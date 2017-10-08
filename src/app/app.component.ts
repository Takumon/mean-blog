import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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
  title: String = 'Material Blog';
  routerName: String;

  isActiveHeader: Boolean;
  isActiveNavbar: Boolean;

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

      this.refreshActiveHeader();
      this.refreshActiveNavbar();
      // 記事詳細はハッシュタグでスクロール制御するので除外
      if (!this.router.url.includes('/articles/')) {
        this.scrollService.scrollToTop();
      }
    });

    this.routeNameService.name.subscribe(name => {
      setTimeout(() => this.routerName = name);
    });

    if (this.auth.isLogin()) {
      this.checkLoginState();
    }
  }

  checkLoginState() {
    this.auth.checkState().subscribe(res => {
      if (res.success !== true) {
        return;
      }
    }, error => {
      // ログイン後に元々表示しようとしていた画面を表示させる
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
  });
  }

  isLoginPage(): boolean {
    return this.router.url && this.router.url.startsWith('/login');
  }


  isNotEditor(): Boolean {
    const url = this.router.url;
    return !url.startsWith('/drafts/');
  }

  refreshActiveHeader(): void {
    const url: String = this.router.url;
    // 前方一致
    this.isActiveHeader = ! url.startsWith('/login');
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

}
