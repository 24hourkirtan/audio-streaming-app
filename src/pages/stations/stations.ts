import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { AudioProvider } from '../../providers/audio/audio';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-stations',
  templateUrl: 'stations.html',
})
export class StationsPage {
  stations : any = [];
  title : string = "";
  temp: any = [];
  infoTimer: any;
  selectedIndex: any = 0;

  constructor(public events: Events, public audio : AudioProvider, private toastCtrl: ToastController) {
    this.stations = audio.getStations();
	  events.subscribe('track', (data) => {
	    this.title = data.title;
	  });
  }

  selectStation(index){
    localStorage.setItem("stationIndex", index);
    /*
    let toast = this.toastCtrl.create({
      message: "Selected: " + this.stations[index].name,
      position: 'middle',
      cssClass: 'center',
      duration: 2000
    });
    toast.present();
    */
    for(var i = 0; i < this.stations.length; i++){
      this.stations[i].selected = false;
    }
    this.stations[index].selected = true;
    this.audio.stop();
    this.audio.init();
    this.audio.play();
    this.events.publish('play');
  }

  ionViewDidLoad(){
    this.title = this.audio.getTrackTitle();

    this.getInfo();

    for(var i = 0; i < this.stations.length; i++){
      this.stations[i].selected = false;
    }
    let index = Number(localStorage.getItem("stationIndex")) ? Number(localStorage.getItem("stationIndex")) : 0;
    this.stations[index].selected = true;

    this.infoTimer = setInterval(()=>{
      this.getInfo();
    }, 5000);
  }

  getInfo(){
    var self = this;
    for(var i = 0; i < self.stations.length; i++){
      self.audio.getInfo(i).then(info => {
        if(info){
          this.temp = info;
          self.stations[this.temp.index].title = this.temp.title;
          self.stations[this.temp.index].artist = this.temp.title.split('-')[0];
          self.stations[this.temp.index].description = this.temp.server_description;
        }
      });
    }
  }
}
