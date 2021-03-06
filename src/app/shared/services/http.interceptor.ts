import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MessageBarService } from './message-bar.service';
import { LocalStorageService, LOCALSTORAGE_KEY } from './local-storage.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private messageBarService: MessageBarService,
    private localStorageService: LocalStorageService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorageService.get(LOCALSTORAGE_KEY.TOKEN);
    const req = request.clone(token
      ? { headers: request.headers.set('x-access-token', token)}
      : { headers: request.headers }
    );
    const hasToken = this.localStorageService.has(LOCALSTORAGE_KEY.TOKEN);
    return next.handle(req).pipe(
      catchError(res => {
        switch (res.status) {
          case 400:
            // 入力チェックエラーは個別にハンドリング
            return throwError(res.error);
          case 403:
            const errors = res.error.errors;
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

          return throwError(JSON.parse(res.error));
        }
      )
    );
  }
}
