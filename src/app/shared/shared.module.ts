import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  MatPaginatorModule,
} from '@angular/material';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { SharedRoutingModule } from './shared-routing.module';

import { AutofocusDirective } from './directives/autofocus.directive';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { ConfirmDialogComponent } from './components/confirm.dialog';
import { MessageBarComponent } from './components/message-bar.component';
import { CustomErrorStateMatcher } from './custom-error-state-matcher';
import { Error403Component } from './components/error-403.component';

@NgModule({
  declarations: [
    AutofocusDirective,
    DragAndDropDirective,
    ConfirmDialogComponent,
    MessageBarComponent,
    Error403Component,
  ],
  imports: [
    BrowserModule,
    LazyLoadImageModule,

    SharedRoutingModule,

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
    MatPaginatorModule,
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher},
    {provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: {float: 'auto'}},
  ],
  entryComponents: [
    ConfirmDialogComponent,
    MessageBarComponent,
  ],
  exports: [
    AutofocusDirective,
    DragAndDropDirective,
    ConfirmDialogComponent,
    MessageBarComponent,
    LazyLoadImageModule,

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
    MatPaginatorModule,
  ],
})
export class SharedModule { }
