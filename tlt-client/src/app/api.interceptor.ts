import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Store, select } from '@ngrx/store';
import { AuthState } from './auth.store';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  private token: string;

  constructor(private store: Store<any>) {
    store.pipe(select('auth')).subscribe(
      (auth: AuthState) => {
        this.token = auth.token;
      }
    )
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token: string;
    if(this.token) token = 'Bearer ' + this.token;
    return next.handle(req.clone({
      url: environment.api + req.url,
      setHeaders: {
        "Authorization": token || ''
      }
    }));
  }
}
