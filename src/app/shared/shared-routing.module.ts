import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Error403Component } from './components/error-403.component';
import { Error404Component } from './components/error-404.component';
import { Error500Component } from './components/error-500.component';

const routes: Routes = [
  {
    path: 'error/403',
    component: Error403Component,
  },
  {
    path: 'error/404',
    component: Error404Component,
  },
  {
    path: 'error/500',
    component: Error500Component,
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SharedRoutingModule {}
