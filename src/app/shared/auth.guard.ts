import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStrageService, KEY } from './services/local-strage.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private localStrageService: LocalStrageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.localStrageService.has(KEY.TOKEN)) {
      return true;
    }

    // ログイン後に元々表示しようとしていた画面を表示させる
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
