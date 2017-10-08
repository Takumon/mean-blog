import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

if ('scrollRestoration' in history) {
  // クロームなどで戻る、更新時にスクロール位置を戻さないようにする
  history.scrollRestoration = 'manual';
}


platformBrowserDynamic().bootstrapModule(AppModule);
