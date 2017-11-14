import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { MessageBarService } from '../../shared/services/message-bar.service';


@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private messageBarService: MessageBarService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const req = request.clone();
    const isTokenSent = !!req.headers.get('x-access-token');
    return next.handle(req).catch(res => {
      switch (res.status) {
        case 403:
          const errors = JSON.parse(res.error).errors;
          if (errors && errors.length > 0) {
            this.messageBarService.showValidationError({errors: errors});
          }
          // クライアント側にトークンあるのに403になる場合はトークンの有効期限切れなので
          // ログイン画面に遷移させる
          if (isTokenSent) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
          }
          break;
      }

      return Observable.throw(JSON.parse(res.error));
    });
  }
}
