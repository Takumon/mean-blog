import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { Error403Component } from './error-403.component';
import { Error404Component } from './error-404.component';
import { Error500Component } from './error-500.component';
import { ErrorsRoutingModule } from './errors-routing.module';


@NgModule({
  declarations: [
    Error403Component,
    Error404Component,
    Error500Component,
  ],
  imports: [
    ErrorsRoutingModule,
    SharedModule
  ],
})
export class ErrorsModule { }
