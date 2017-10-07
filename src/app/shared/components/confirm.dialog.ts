import {Component, Inject} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm.dialog.html',
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }
}
