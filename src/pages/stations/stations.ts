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
    this.title = this.audio.getTrackTitle();
  }
}
