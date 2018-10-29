import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { catchError, retry } from "rxjs/operators";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the CryptoCurrenciesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CryptoCurrenciesProvider {
  apiUrl: string = 'http://kryptopay.herokuapp.com/api/v1/crypto/'
  localhostApiUrl: string = 'http://127.0.0.1:8000/api/v1/crypto/?format=json'
  
  constructor(public http: HttpClient) {
    console.log('Hello CryptoCurrenciesProvider Provider');
  }

  getCurrencies() {
    // return this.http.get(this.localhostApiUrl)
    //   .pipe(
    //     retry(3), // retry a failed request up to 3 times
    //     catchError(this.handleError) // then handle the error
    //   );
    return this.http.get(this.localhostApiUrl)
      .map(this.extractData)
      .catch(this.handleError)

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

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // };

}
