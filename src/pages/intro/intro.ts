import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  text : string = "Welcome to the <br>world of Kirtan, <br>the radio app <br>for traditional <br>Kirtan and <br>contemporary <br>Vaishnava music.";
  loadProgress: any = 0;
  angle : any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	setInterval(() => {
  		if(this.loadProgress < 100){
			this.loadProgress += 0.24;
  		}
  		this.angle += 1;

  		if(this.angle > 360)
  			this.angle = 0;
	}, 10);

	setTimeout(() => {
		this.text = "Hare Krishna,<br>Hare Krishna,<br>Krishna Krishna,<br>Hare Krishna,<br>Hare Rama,<br>Hare Rama,<br>Rama Rama,<br>Hare Hare.";
	}, 2500);

	setTimeout(() => {
	    this.navCtrl.setRoot(TabsPage);
	}, 0);
  }
}
