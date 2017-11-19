import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Error403Component } from './components/error-403.component';

const routes: Routes = [
  {
    path: 'error/403',
    component: Error403Component,
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class SharedRoutingModule {}
