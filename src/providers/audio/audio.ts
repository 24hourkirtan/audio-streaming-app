import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

import { Network } from '@ionic-native/network';
import { Media } from '@ionic-native/media';
import { APP_CONFIG, ApplicationConfig } from '../../app/app-config';
import { Platform } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { MusicControls } from '@ionic-native/music-controls';

@Injectable()
export class AudioProvider {
	stations : any;
	source: any;
	toast: any;
	infoTimer: any;
	title: string = "";
	isHighBandwidth: boolean = true;
	isOnline: boolean = false;
	isPlaying : boolean = false;

	constructor(public http: HttpClient, private media: Media, private network: Network, private toastCtrl: ToastController, public events: Events, private musicControls: MusicControls,
		@Inject(APP_CONFIG) private config: ApplicationConfig, public plt: Platform) {
		this.stations = this.getStations();

		this.plt.ready().then((readySource) => {
			this.checkConnectionStatus();
			this.network.onchange().subscribe((data) => {
				setTimeout(() => {
					this.checkConnectionStatus();
				}, 1000);
			});
		});
	}

	checkConnectionStatus(){
		if(this.network.type == "wifi" || this.network.type == "4g"){
			this.isHighBandwidth = true;
			this.isOnline = true;
			if(this.source)
				this.stop();
			this.init();
			if(this.isPlaying)
				this.play();
		}
		else if(this.network.type == "none"){
			this.isHighBandwidth = false;
			this.isOnline = false;
			if(this.source)
				this.stop();
		}
		else{
			this.isHighBandwidth = false;
			this.isOnline = true;
			if(this.source)
				this.stop();
			this.init();
			if(this.isPlaying)
				this.play();
		}
	}

	getStations(){
		return this.config["STATIONS"];
	}

	init(){
		let index = Number(localStorage.getItem("stationIndex")) ? Number(localStorage.getItem("stationIndex")) : 0;
		this.source = this.media.create(this.isHighBandwidth ? this.stations[index].hiFi : this.stations[index].loFi);

		this.source.onStatusUpdate.subscribe(status =>{
  		if(status == 1){ // Loaded
  			this.toast = this.toastCtrl.create({
  				message: 'Loading: ' + this.stations[index].name,
  				position: 'middle',
  				cssClass: 'center'
  			});
  			this.toast.present();
  		} 
  		else if(status == 2){ // Playing
  			this.isPlaying = true;
  			this.toast.dismiss();
  		} 
  		else if(status == 3){ // Stopped
  			this.isPlaying = false;
  		}
  	}); // fires when file status changes
	}

	getTrackTitle(){
		let index = Number(localStorage.getItem("stationIndex")) ? Number(localStorage.getItem("stationIndex")) : 0;
		return this.title ? this.title : this.stations[index].name;
	}

	play(){
		this.isPlaying = true;
		this.source.play();
		this.getStreamInfo();
		this.infoTimer = setInterval(()=>{
			this.getStreamInfo();
		}, 5000);
	}

	pause(){ 
		this.source.pause();
		this.isPlaying = false;
		clearInterval(this.infoTimer);
	}

	stop(){
		this.source.stop();
		clearInterval(this.infoTimer);
	}

	getInfo(stationIndex){
		return new Promise((resolve, reject) => {
			this.http.get(this.stations[stationIndex].METADATA_URL).subscribe( data => {
				if(data && data.hasOwnProperty('icestats')){
					let stations = data['icestats']['source'];
					let info = {
						title: ""
					};

					for(let i = 0; i < stations.length; i++){
						if(this.stations[stationIndex].name == stations[i].server_name || this.stations[stationIndex].alias == stations[i].server_name){
							info = stations[i];
							info.index = stationIndex;
							break;
						}
					}
					resolve(info);
				}
			});
		});
	}

	getStreamInfo() {
		let index = Number(localStorage.getItem("stationIndex"));
		this.http.get(this.stations[index].METADATA_URL).subscribe( data => {
			if(data && data.hasOwnProperty('icestats')){
				let stations = data['icestats']['source'];
				let info = {
					title: "",
					index: index
				};


				for(let i = 0; i < stations.length; i++){
					if(this.stations[index].name == stations[i].server_name || this.stations[index].alias == stations[i].server_name){
						info = stations[i];
						break;
					}
				}

		        if(this.title != info.title){
		        	this.title = info.title;
		        	this.events.publish('track', info);

		        	let details = info.title.split('-');

			        let track = details.length > 1 ? details[1] : info.title;
			        let artist = details.length > 1 ? details[0] : "";
			        let album = "";
			        let image = "https://s3.amazonaws.com/strollio/art.jpg";
			        let duration = 0;
			        let elapsedTime = 0;
			        
			        let params = [artist, track, album, image, duration, elapsedTime];

			        // Populate music controls
		        	this.musicControls.create({
					    track       : track,        // optional, default : ''
					    artist      : artist,                       // optional, default : ''
					    cover       : image,      // optional, default : nothing
					    isPlaying   : true,                         // optional, default : true

					    // hide previous/next/close buttons:
					    hasPrev   : false,      // show previous button, optional, default: true
					    hasNext   : false,      // show next button, optional, default: true
					    hasClose  : true,       // show close button, optional, default: false

					    // Android only, optional
					    // text displayed in the status bar when the notification (and the ticker) are updated
					    ticker    : 'Now playing ' + track
		    		});
	    			this.subscribeEvents();
		        }

			}
		});
	}

	subscribeEvents() {
		this.musicControls.subscribe().subscribe(action => {
		    const message = JSON.parse(action).message;
	      	switch(message) {
	          case 'music-controls-next':
	              // Do something
	              break;
	          case 'music-controls-previous':
	              // Do something
	              break;
	          case 'music-controls-pause':
	              this.pause();
	              this.musicControls.updateIsPlaying(false);
	              this.events.publish('pause');
	              break;
	          case 'music-controls-play':
	              this.play();
	              this.musicControls.updateIsPlaying(true);
	              this.events.publish('play');
	              break;
	          case 'music-controls-destroy':
	              // Do something
	              break;
	          // Headset events (Android only)
	          case 'music-controls-media-button' :
	              // Do something
	              break;
	          case 'music-controls-headset-unplugged':
	              // Do something
	              break;
	          case 'music-controls-headset-plugged':
	              // Do something
	              break;
	          default:
	              break;
	      }
	  });
	  this.musicControls.listen();
	}
}
