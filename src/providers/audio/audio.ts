import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

import { Network } from '@ionic-native/network';
import { Media, MediaObject } from '@ionic-native/media';
import { APP_CONFIG, AppConfig } from '../../app/app-config';
import { Platform } from 'ionic-angular';

@Injectable()
export class AudioProvider {
	stations : any;
	source: any;

  constructor(public http: HttpClient, private media: Media, private network: Network,
  @Inject(APP_CONFIG) private config: AppConfig, public plt: Platform) {
  	this.stations = this.getStations();
  	let index = Number(localStorage.getItem("stationIndex")) ? Number(localStorage.getItem("stationIndex")) : 0;

 	this.plt.ready().then((readySource) => {
      this.init(this.stations[index].hiFi);
    });
  }

  getStations(){
  	return this.config["STATIONS"];
  }

  init(path){
  	this.source = this.media.create(path);
  }

  play(){
  	this.source.play();
  	this.getStreamInfo().subscribe( data => {
  		console.log(data.icestats.source[0]);
  	});
  }

  pause(){
  	this.source.pause();
  }

  getStreamInfo() {
  	let index = Number(localStorage.getItem("stationIndex"));
    return this.http.get(this.stations[index].metadata_url);
  }
}
