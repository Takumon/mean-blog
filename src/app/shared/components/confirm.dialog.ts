import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm.dialog.html',
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
