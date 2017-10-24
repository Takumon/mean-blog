import { NgModule } from '@angular/core';

import {
  ErrorStateMatcher,
  MAT_PLACEHOLDER_GLOBAL_OPTIONS,

  MatToolbarModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatMenuModule,
  MatTabsModule,
  MatInputModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatCardModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
} from '@angular/material';


import { AutofocusDirective } from './directives/autofocus.directive';
import { ConfirmDialogComponent } from './components/confirm.dialog';
import { CustomErrorStateMatcher } from './custom-error-state-matcher';

@NgModule({
  declarations: [
    AutofocusDirective,
    ConfirmDialogComponent,
  ],
  imports: [
    MatToolbarModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTabsModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher},
    {provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: {float: 'auto'}},
  ],
  entryComponents: [
    ConfirmDialogComponent,
  ],
  exports: [
    AutofocusDirective,
    ConfirmDialogComponent,

    MatToolbarModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTabsModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
  ],
})
export class SharedModule { }
