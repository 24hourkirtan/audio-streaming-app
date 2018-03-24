import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

 @IonicPage()
 @Component({
 	selector: 'page-gallery',
 	templateUrl: 'gallery.html',
 })
 export class GalleryPage {

 	background : any = "KRFM_DSKTP_02";
 	visible: any = true;
 	fadeTimer : Number = 2000;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
 		setTimeout(x => 
 		{
 			this.visible = false;
 		}, this.fadeTimer);
 	}

 	selectBackground(choice){
 		this.background = choice;
 	}

 	ionSelected(){
 		this.visible = true;
 		setTimeout(x => 
 		{
 			this.visible = false;
 		}, this.fadeTimer);
 	}

 	tapped(){
 		this.visible = true;
 		setTimeout(x => 
 		{
 			this.visible = false;
 		}, this.fadeTimer);
 	}
 }
