import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Constant } from './shared/constant';
import {
  AuthenticationService,
} from './shared/services';


import * as fromApp from './state';
import { ScrollService } from './articles/shared/scroll.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  title: String = 'Material Blog';
  routerName$: Observable<string>;

  isActiveNavbar: boolean;

  constructor(
    private router: Router,
    private store: Store<fromApp.State>,
    public auth: AuthenticationService,
    private scrollService: ScrollService,
  ) {
    this.routerName$ = this.store.select(fromApp.getTitle);
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
       return;
      }

      this.refreshActiveNavbar();
      // 記事詳細はハッシュタグでスクロール制御するので除外
      if (!this.router.url.startsWith('/articles/')) {
        this.scrollService.scrollToTop();
      }
    });


    // auth.guardで認証していない場合のみ認証チェックを行う
    if (!this.auth.isFinishedCheckState) {
      this.checkLoginState();
    }
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
    if (url === '/dashbord' || url === '/dashbord/articles') {
      this.isActiveNavbar = true;
    } else {
      this.isActiveNavbar = false;
    }
  }

  login() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
  }

  registerUser() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url,  }});
  }
}
