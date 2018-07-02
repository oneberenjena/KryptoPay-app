import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TasasPage } from './tasas';

@NgModule({
  declarations: [
    TasasPage,
  ],
  imports: [
    IonicPageModule.forChild(TasasPage),
  ],
})
export class TasasPageModule {}
