import {
  Component,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  // snackBarを使う側がsnackBarRefをココに代入する
  public instanceForSnackBar: any;

  private hide(messageInfo) {
    messageInfo.hide = true;
    if (this.data.messages.every(m => m.hide)) {
      this.instanceForSnackBar.dismiss();
    }
  }
}
