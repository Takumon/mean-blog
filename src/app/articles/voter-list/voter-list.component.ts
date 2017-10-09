import {Component, Inject} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-voter-list-dialog',
  templateUrl: './voter-list.component.html',
  styleUrls: ['./voter-list.component.scss'],
})
export class VoterListComponent {

  constructor(
    public dialogRef: MdDialogRef<VoterListComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  close(): void {
    this.dialogRef.close();
  }
}
