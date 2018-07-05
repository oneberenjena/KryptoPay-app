import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Http } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the FeesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FeesProvider {
  // private path: string = 'https://kryptomeerkat-lbcapi.herokuapp.com/'
  private path: string = 'assets/fees/prices.json';
  // private path: string = '../../../www/assets/fees/prices.json';

  constructor(public http: HttpClient) {
    console.log('Starting localbitcoins BTC mean price calculator.');
  }

  getFees(): any {
    return this.http.get(this.path)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }
}
