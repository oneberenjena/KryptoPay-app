import { CryptoCurrenciesProvider } from './../../providers/crypto-currencies/crypto-currencies';
import { CryptoCurrency, CryptoList } from './../../data-model';
import { FeesProvider } from './../../providers/fees/fees';
import { stringify } from '@angular/compiler/src/util';
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
  res: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public feesProvider: FeesProvider,
    public cryptoProvider: CryptoCurrenciesProvider
  ) {
    this.fees = new CryptoList();
    this.loadCrypto();
    this.getFees();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TasasPage');
  }

  updateFee(slidingCurrency: ItemSliding) {
    this.getFees();
    slidingCurrency.close();
  }

  private loadCrypto() {
    this.cryptoProvider.getCurrencies()
      .subscribe(
        fees => this.setCrypto(fees),
        error => this.errorMessage = <any>error
      );
  }

  private setCrypto(jsonObject: any): any {
    console.log(typeof(jsonObject));
    if (!jsonObject) {
      return null;
    }

    jsonObject.objects.forEach(crypto => {
      console.log(crypto.cryptoName);
      if (!this.fees.cryptoExists(crypto.cryptoName)){
        let newCrypto = new CryptoCurrency(crypto.cryptoName);
        this.fees.addCrypto(newCrypto);
      }
    });
  }

  private getFees() {
    this.feesProvider.getFees()
      .subscribe(
        fee => this.fees.updateCryptoValue(fee.name, fee.value),
        error => this.errorMessage = <any>error
      );
  }

}
