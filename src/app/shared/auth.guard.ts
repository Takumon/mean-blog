import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService, KEY } from './services/local-storage.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.localStorageService.has(KEY.TOKEN)) {
      return true;
    }

    // ログイン後に元々表示しようとしていた画面を表示させる
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
