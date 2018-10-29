import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { catchError} from "rxjs/operators";

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
  apiUrl:string = 'http://kryptopay.herokuapp.com/api/v1/worker/login/'
  localhostApiUrl:string = 'http://127.0.0.1:8000/api/v1/worker/login/'

  constructor(public http: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }

  loginUser(data: { 'username': string, 'password': string }): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(this.localhostApiUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // private extractData(res: Response) {
  //   let body = res;
  //   return body || {};
  // }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
