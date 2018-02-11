import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { AuthenticationService } from './services/authentication.service';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthenticationService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    if (this.auth.isFinishedCheckState) {
      return this.authorizedRouting(state);
    }

    // 未認証時は認証チェックして判断する
    return this.auth.checkState()
      .map(res => this.authorizedRouting(state))
      .catch(err => {
        // 未妊省の状態なのでログイン画面に遷移させる
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return Observable.of(false);
      });
  }

  authorizedRouting(state: RouterStateSnapshot): boolean {
    if (!this.auth.isLogin()) {
      // ログイン後に元々表示しようとしていた画面を表示させる
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }

    if (!this.auth.isAdmin()) {
      // 権限エラーページに遷移させる
      this.router.navigate(['/error', '403']);
      return false;
    }

    return true;
  }
}
