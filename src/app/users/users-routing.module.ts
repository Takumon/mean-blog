import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { AuthGuard } from '../shared/auth.guard';


const routes: Routes = [
  { path: ':_userId/profile', component: UserDetailComponent , canActivate: [AuthGuard] },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class UsersRoutingModule {}
