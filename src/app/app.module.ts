import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { IntroPage } from '../pages/intro/intro';
import { SelectStationPage } from '../pages/select-station/select-station';
import { InfoPage } from '../pages/info/info';
import { GalleryPage } from '../pages/gallery/gallery';
import { StationsPage } from '../pages/stations/stations';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AudioProvider } from '../providers/audio/audio';
import { Network } from '@ionic-native/network';
import { Media } from '@ionic-native/media';
import { APP_CONFIG, AppConfig } from './app-config';
import { HttpClientModule } from '@angular/common/http';
import { MusicControls } from '@ionic-native/music-controls';
import { File } from '@ionic-native/file';


@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    SelectStationPage,
    InfoPage,
    GalleryPage,
    StationsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    SelectStationPage,
    InfoPage,
    GalleryPage,
    StationsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AudioProvider,
    Network,
    Media,
    HttpClientModule,
    { provide: APP_CONFIG, useValue: AppConfig },
    MusicControls,
    File
  ]
})
export class AppModule {}
