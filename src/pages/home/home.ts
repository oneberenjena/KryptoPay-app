import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public worker: any;

  constructor(
    public navCtrl: NavController,
    private storage: Storage
  ) {
    if (this.storage.ready()) {
      let workerInStorage = this.storage.get('worker');
      this.worker = JSON.parse(workerInStorage);
      console.log(this.worker);
      
    }
  }

}
