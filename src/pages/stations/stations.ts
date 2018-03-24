import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AudioProvider } from '../../providers/audio/audio';

@IonicPage()
@Component({
  selector: 'page-stations',
  templateUrl: 'stations.html',
})
export class StationsPage {
  stations : any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public audio : AudioProvider) {

    this.stations = audio.getStations();

	  events.subscribe('track', (title) => {
	   
	    
	  });
  }

  selectStation(index){
    localStorage.setItem("stationIndex", index);
  }
}
