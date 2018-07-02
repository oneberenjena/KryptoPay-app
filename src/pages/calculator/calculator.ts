import { CryptoCurrency } from './../../data-model';
import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { FeesProvider } from './../../providers/fees/fees';


/**
 * Generated class for the CalculatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})

export class CalculatorPage {
  date: String = moment().format();
  amountBsf: number;
  amountCrypto: number;
  // selectedCrypto: {
  //   name: string,
  //   value: number
  // };
  selectedCrypto: CryptoCurrency;
  // availableCrypto: Array<{
  //   name: string,
  //   value: number
  // }> = [];
  availableCrypto: Array<CryptoCurrency>;
  operation: { id: number, amountBs: number, amountBtc: number, date: Date }
  errorMessage: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public fees: FeesProvider
  ) {
    this.selectedCrypto = undefined;
    this.getFees();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalculatorPage');
  }

  onBsfChange(event) {
    this.amountCrypto = this.amountBsf / this.selectedCrypto.value;
  }

  onCryptoChange(event) {
    this.amountBsf = this.amountCrypto * this.selectedCrypto.value;
  }

  getFees() {
    this.fees.getFees()
      .subscribe(
        fees => this.availableCrypto.push(fees),
        error => this.errorMessage = <any>error
      );
  }

  createOperation() {
    this.operation.amountBs = this.amountBsf;
    this.operation.amountBtc = this.amountCrypto;
    this.operation.date = new Date();
  }
}
