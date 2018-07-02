import { CryptoCurrency, CryptoList } from './../../data-model';
import { FeesProvider } from './../../providers/fees/fees';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TasasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tasas',
  templateUrl: 'tasas.html',
})
export class TasasPage {
  fees: Array<{ name: string, value: number }> = [];
  // fees: Array<CryptoCurrency> = [];
  // fees: CryptoList;
  selectedCurrency: CryptoCurrency;
  errorMessage: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public feesProvider: FeesProvider
  ) {
    this.getFees();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TasasPage');
  }

  getFees() {
    this.feesProvider.getFees()
      .subscribe(
        // fee => this.fees.storeOperation(fee),
        fee => this.fees.push(fee),
        error => this.errorMessage = <any>error
      );
  }

}
