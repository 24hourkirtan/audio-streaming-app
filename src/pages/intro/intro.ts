import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SelectStationPage } from '../select-station/select-station';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	setTimeout(() => {
		if(!localStorage.getItem("stationIndex")){
	    	this.navCtrl.setRoot(SelectStationPage);
	    }
	    else {
	    	this.navCtrl.setRoot(TabsPage);
	    }
	}, 2000);
  }
}
