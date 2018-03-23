import { Component } from '@angular/core';

import { InfoPage } from '../info/info';
import { GalleryPage } from '../gallery/gallery';
import { StationsPage } from '../stations/stations';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
	
  tab1Root = InfoPage;
  tab2Root = GalleryPage;
  tab3Root = StationsPage;

  playing : boolean = false;
  playbackIcon : any = "ios-play";

  constructor() {

  }

  togglePlayback(){
  	if(!this.playing){
  		this.playbackIcon = "ios-pause";
  	}
  	else{
  		this.playbackIcon = "ios-play";
  	}
  	this.playing = !this.playing;
  }
}
