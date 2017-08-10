import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CurrentUserService } from './services/current-user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.currentUserService.hasToken()) {
      return true;
    }

    // ログイン後に元々表示しようとしていた画面を表示させる
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
