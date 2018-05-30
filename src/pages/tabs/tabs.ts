import { Component, ChangeDetectorRef } from '@angular/core';

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

  constructor(public events: Events, public audio : AudioProvider, private chRef: ChangeDetectorRef) {
    events.subscribe('play', () => {
        this.playing = true;
        chRef.detectChanges();
    });

    events.subscribe('pause', () => {
        this.playing = false;
        chRef.detectChanges();
    });
  }

  togglePlayback(){
  	if(!this.playing){
      this.audio.play();
  	}
  	else{
      this.audio.pause();
  	}
  	this.playing = !this.playing;
  }
}
