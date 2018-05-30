import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationsPage } from './stations';

@NgModule({
  declarations: [
    StationsPage,
  ],
  imports: [
    IonicPageModule.forChild(StationsPage),
  ],
})
export class StationsPageModule {}
