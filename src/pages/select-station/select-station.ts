import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AudioProvider } from '../../providers/audio/audio';

@Component({
  selector: 'page-select-station',
  templateUrl: 'select-station.html'
})
export class SelectStationPage {
  stations : any = [];

  constructor(public navCtrl: NavController, public audio : AudioProvider) {
    this.stations = audio.getStations();
  }

  selectStation(index){
    localStorage.setItem("stationIndex", index);
  }
}
