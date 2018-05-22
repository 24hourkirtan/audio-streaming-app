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
    this.audio.stop();
    this.audio.init();
    this.audio.play();
    this.events.publish('play');
  }

  ionViewDidLoad(){
    var self = this;
    this.title = this.audio.getTrackTitle();
    
    self.audio.getInfo().then(stations => {
      if(stations){
        this.temp = stations;
        for(var i = 0; i < self.stations.length; i++){
          for(var j = 0; j < this.temp.length; j++){
            if(self.stations[i].name == this.temp[j].server_name){
              self.stations[i].title = this.temp[j].title;
              self.stations[i].artist = this.temp[j].title.split('-')[0];
              self.stations[i].description = this.temp[j].server_description;
            }
          }
        }
      }
    });
  }
}
