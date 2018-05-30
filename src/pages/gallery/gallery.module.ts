import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GalleryPage } from './gallery';

@NgModule({
  declarations: [
    GalleryPage,
  ],
  imports: [
    IonicPageModule.forChild(GalleryPage),
  ],
})
export class GalleryPageModule {}
