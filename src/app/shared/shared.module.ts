import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule　} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ErrorStateMatcher,
  MAT_LABEL_GLOBAL_OPTIONS,

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
  DateAdapter,
} from '@angular/material';
import { LazyLoadImageModule } from 'ng-lazyload-image';


import { AutofocusDirective } from './directives/autofocus.directive';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import {
  ConfirmDialogComponent,
  MessageBarComponent,
} from './components';
import {
  CheckedListPipe,
  NotCheckedListPipe,
  KeysPipe,
  MarkdownParsePipe,
  SafeHtmlPipe,
  OrderByPipe,
  ExcludeDeletedCommentPipe,
  ExcludeDeletedVoterPipe
} from './pipes';
import { CustomErrorStateMatcher } from './custom-error-state-matcher';

import { AppDateAdapter } from './app-date-adapter';


@NgModule({
  declarations: [
    AutofocusDirective,
    DragAndDropDirective,
    ConfirmDialogComponent,
    MessageBarComponent,
    OrderByPipe,
    SafeHtmlPipe,
    MarkdownParsePipe,
    KeysPipe,
    CheckedListPipe,
    NotCheckedListPipe,
    ExcludeDeletedCommentPipe,
    ExcludeDeletedVoterPipe,
  ],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    ReactiveFormsModule,

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
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'auto'} },
  ],
  entryComponents: [
    ConfirmDialogComponent,
    MessageBarComponent,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,

    OrderByPipe,
    SafeHtmlPipe,
    MarkdownParsePipe,
    KeysPipe,
    CheckedListPipe,
    NotCheckedListPipe,
    ExcludeDeletedCommentPipe,
    ExcludeDeletedVoterPipe,

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
