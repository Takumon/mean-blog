import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtTokenService } from './services/jwt-token.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private token: JwtTokenService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.token.has()) {
      return true;
    }

    // ログイン後に元々表示しようとしていた画面を表示させる
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
