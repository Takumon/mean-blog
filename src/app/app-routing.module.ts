import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'drafts', loadChildren: 'app/drafts/drafts.module#DraftsModule' },
  { path: 'login', loadChildren: 'app/login/login.module#LoginModule' },
  { path: 'error', loadChildren: 'app/errors/errors.module#ErrorsModule' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
