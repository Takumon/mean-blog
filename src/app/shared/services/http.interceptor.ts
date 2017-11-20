import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { MessageBarService } from '../../shared/services/message-bar.service';
import { LocalStrageService, KEY } from '../../shared/services/local-strage.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private messageBarService: MessageBarService,
    private localStrageService: LocalStrageService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const req = request.clone();
    const hasToken = this.localStrageService.has(KEY.TOKEN);
    return next.handle(req).catch(res => {
      switch (res.status) {
        case 400:
          // 入力チェックエラーは個別にハンドリング
          return Observable.throw(JSON.parse(res.error));
        case 403:
          const errors = JSON.parse(res.error).errors;
          if (errors && errors.length > 0) {
            this.messageBarService.showValidationError({errors: errors});
          }

          // クライアント側にトークンあるのに403になる場合はトークンの有効期限切れなので
          // ログイン画面に遷移させる
          if (hasToken) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
          }
          return;
        case 404:
          this.router.navigate(['/error/404']);
          return;
        case 500:
          this.router.navigate(['/error/500']);
          return;
        }

        return Observable.throw(JSON.parse(res.error));
      });
  }
}
