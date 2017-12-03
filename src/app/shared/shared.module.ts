import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule　} from '@angular/forms';

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
import { Error404Component } from './components/error-404.component';
import { Error500Component } from './components/error-500.component';

@NgModule({
  declarations: [
    AutofocusDirective,
    DragAndDropDirective,
    ConfirmDialogComponent,
    MessageBarComponent,
    Error403Component,
    Error404Component,
    Error500Component,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LazyLoadImageModule,
    ReactiveFormsModule,
    FormsModule,

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
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,

    SharedRoutingModule,


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
