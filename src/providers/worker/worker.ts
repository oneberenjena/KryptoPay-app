import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { catchError, retry } from "rxjs/operators";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/*
  Generated class for the WorkerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WorkerProvider {
  apiUrl: string = 'http://kryptopay.herokuapp.com/api/v1/worker/?format=json'
  localhostApiUrl: string = 'http://127.0.0.1:8000/api/v1/worker/?format=json'

  constructor(public http: HttpClient) {
    console.log('Hello WorkerProvider Provider');
  }

  getWorker(username: string) {
    return this.http.get(this.localhostApiUrl + "&" + username)
      .map(this.extractData)
      .catch(this.handleError)

  }

  private extractData(res: Response) {
    let body = res;
    return body.objects[0] || {};
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
