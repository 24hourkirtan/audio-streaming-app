import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AudioProvider } from '../../providers/audio/audio';

@IonicPage()
@Component({
	selector: 'page-info',
	templateUrl: 'info.html',
})
export class InfoPage {
	title : string;
	constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public audio : AudioProvider) {
		events.subscribe('track', (data) => {
			this.title = data.title;
		});
	}

	ionViewDidLoad(){
		this.title = this.audio.getTrackTitle();
	}
}
