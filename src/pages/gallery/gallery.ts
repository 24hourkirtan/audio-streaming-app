import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AudioProvider } from '../../providers/audio/audio';
import { File } from '@ionic-native/file';

 @IonicPage()
 @Component({
 	selector: 'page-gallery',
 	templateUrl: 'gallery.html',
 })
 export class GalleryPage {

 	background : any = "";
 	visible: any = true;
 	fadeTimer : Number = 2000;
 	title : string = ""; 
 	gallery : string = "";
 	galleries: any = [];
 	photos: any = [];
 	galleryTimer : any;
 	galleryCounter : any;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public audio : AudioProvider, private file: File) {

 	  events.subscribe('track', (data) => {
	    this.title = data.title;
	  });

 		setTimeout(x => 
 		{
 			this.visible = false;
 		}, this.fadeTimer);

 		console.log(this.file);
 		this.gallery = localStorage.getItem("gallery");
 		if(this.gallery){
 			this.file.listDir(this.file.applicationDirectory, 'www/assets/imgs/galleries/' + this.gallery).then(photos => {
 					this.photos = photos;
 					console.log(photos);
 					this.resetGallery();
 			}).catch(err => console.log('Gallery doesnt exist'));
 		}

 		this.file.listDir(this.file.applicationDirectory, 'www/assets/imgs/galleries').then(galleries => {
 			this.galleries = galleries;
 			if(!this.gallery){
 				this.gallery = galleries[0].name;
 				this.file.listDir(this.file.applicationDirectory, 'www/assets/imgs/galleries/' + this.gallery).then(photos => {
	 					this.photos = photos;
	 					this.resetGallery();
	 			}).catch(err => console.log('Gallery doesnt exist'));
 			}
 		}).catch(err => console.log('Directory doesnt exist'));
 	}

 	selectBackground(gallery){
 		localStorage.setItem("gallery", gallery);
 		this.gallery = gallery;
 		
		this.file.listDir(this.file.applicationDirectory, 'www/assets/imgs/galleries/' + this.gallery).then(photos => {
				this.photos = photos;
				this.resetGallery();
		}).catch(err => console.log('Gallery doesnt exist'));
 	}

 	resetGallery(){
 		// Reset gallery rotation
		this.galleryCounter = 0;

 		if(this.galleryTimer)
 			clearInterval(this.galleryTimer);

 		this.background = this.gallery + '/' + this.photos[this.galleryCounter].name;
 		this.galleryCounter++;

		this.galleryTimer = setInterval(()=>{
			this.background = this.gallery + '/' + this.photos[this.galleryCounter].name;
			this.galleryCounter++;
			if(this.galleryCounter >= this.photos.length)
				this.galleryCounter = 0;
		}, 8000);
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

	  ionViewDidLoad(){
	    this.title = this.audio.getTrackTitle();
	  }
 }
