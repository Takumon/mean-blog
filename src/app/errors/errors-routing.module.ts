import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Error403Component } from './error-403.component';
import { Error404Component } from './error-404.component';
import { Error500Component } from './error-500.component';

const routes: Routes = [
  {
    path: '403',
    component: Error403Component,
  },
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: '500',
    component: Error500Component,
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ErrorsRoutingModule {}
