import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Constant } from './shared/constant';
import { AuthenticationService } from './shared/services/authentication.service';
import { RouteNamesService } from './shared/services/route-names.service';
import { UserModel } from './users/shared/user.model';
import { NavLinkModel } from './shared/models/nav-link.model';
import { ScrollService } from './shared/services/scroll.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public Constant = Constant;
  title: String = 'Material Blog';
  routerName: String;

  isActiveNavbar: boolean;

  constructor(
    private router: Router,
    public routeNameService: RouteNamesService,
    public auth: AuthenticationService,
    private scrollService: ScrollService,
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
       return;
      }

      this.refreshActiveNavbar();
      // 記事詳細はハッシュタグでスクロール制御するので除外
      if (!this.router.url.includes('/articles/')) {
        this.scrollService.scrollToTop();
      }
    });

    this.routeNameService.name.subscribe(name => {
      setTimeout(() => this.routerName = name);
    });

    this.checkLoginState();
  }

  checkLoginState() {
    // 実処理はauthでやるためここは呼び出しのみ
    this.auth.checkState().subscribe(res => {});
  }

  isLoginPage(): boolean {
    return this.router.url && this.router.url.startsWith('/login');
  }


  isNotEditor(): Boolean {
    const url = this.router.url;

    // 記事登録
    if ( url.startsWith('/drafts/') && url.endsWith('/new')) {
      return false;
    }

    // 記事編集
    if ( url.startsWith('/drafts/') && url.includes('/edit')) {
      return false;
    }

    // それ以外
    return true;
  }


  refreshActiveNavbar(): void {
    const url: String = this.router.url;

    // 完全一致
    if (url === '/' || url === '/articles') {
      this.isActiveNavbar = true;
    } else {
      this.isActiveNavbar = false;
    }
  }

  login() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
  }

  registeruser() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url,  }});
  }

}
