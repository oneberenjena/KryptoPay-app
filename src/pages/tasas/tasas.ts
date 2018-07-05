import { CryptoCurrency, CryptoList } from './../../data-model';
import { FeesProvider } from './../../providers/fees/fees';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding } from 'ionic-angular';

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
  fees: CryptoList;
  selectedCurrency: CryptoCurrency;
  errorMessage: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public feesProvider: FeesProvider
  ) {
    this.fees = new CryptoList();
    this.getFees();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TasasPage');
  }

  updateFee(slidingCurrency: ItemSliding){
    this.getFees();
    slidingCurrency.close();
  }

  getFees() {
    this.feesProvider.getFees()
      .subscribe(
        fee => this.fees.updateCryptoValue(fee.name, fee.value),
        error => this.errorMessage = <any>error
      );
  }

}
