import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-select-station',
  templateUrl: 'select-station.html'
})
export class SelectStationPage {

  constructor(public navCtrl: NavController) {

  }

  selectStation(station){
  	if(station == "Raydio"){
		this.navCtrl.push(TabsPage);
  	}
  	else{
  		this.navCtrl.push(TabsPage);
  	}
  }
}
