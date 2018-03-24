import { Component } from '@angular/core';

import { InfoPage } from '../info/info';
import { GalleryPage } from '../gallery/gallery';
import { StationsPage } from '../stations/stations';
import { Events } from 'ionic-angular';
import { AudioProvider } from '../../providers/audio/audio';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
	
  tab1Root = InfoPage;
  tab2Root = GalleryPage;
  tab3Root = StationsPage;

  playing : boolean = false;
  playbackIcon : any = "ios-play";

  constructor(public events: Events, public audio : AudioProvider) {
  /*
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
    */
  }

  togglePlayback(){
  	if(!this.playing){
  		this.playbackIcon = "ios-pause";
      this.audio.play();
  	}
  	else{
  		this.playbackIcon = "ios-play";
      this.audio.pause();
  	}
  	this.playing = !this.playing;
  }
}
