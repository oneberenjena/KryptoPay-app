import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, List} from 'ionic-angular';

/**
 * Generated class for the BalancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html',
})
export class BalancePage {
  date: string;
  operations: Array<{
    date: Date,
    id: number,
    amount: number
  }>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.date = this.getDate();
    this.operations = [{
      date: new Date(),
      id: 1,
      amount: 50000
    }, {
      date: new Date(),
      id: 2,
      amount: 52000
    }, {
      date: new Date(),
      id: 3,
      amount: 58000
    }, {
      date: new Date(),
      id: 4,
      amount: 58622
    }]
    // retrieve operations from bd or cache
  }

  getDate(date: Date = new Date()): string {
    let day: string = "" + date.getDate();
    let monthInt: number = date.getMonth() + 1;
    let month: string = monthInt < 10 ? "0" + monthInt : "" + monthInt;
    let year: string = "" + date.getFullYear();
    return [day, month, year].join('/');
  }

  getTime(date: Date = new Date()): string {
    let hours: string = "" + date.getHours();
    let minutes: any = date.getMinutes();
    minutes =  minutes < 10 ? "0" + minutes : "" + minutes ;
    return [hours, minutes].join(':');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BalancePage');
  }

}
