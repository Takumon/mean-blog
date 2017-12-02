import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormGroupDirective,
  FormControl,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Constant } from '../../shared/constant';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MessageService } from '../../shared/services/message.service';
import { MessageBarService } from '../../shared/services/message-bar.service';

import { ReplyModel } from '../shared/reply.model';
import { ReplyService } from '../shared/reply.service';


@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['./reply-form.component.scss']
})
export class ReplyFormComponent implements OnInit, AfterViewChecked {
  public Constant = Constant;

  @Input() isAuthfocuse: boolean;
  @Input() model: ReplyModel;
  @Input() hasCancelBtn: boolean;
  @Output() complete = new EventEmitter();
  @Output() cancel = new EventEmitter();
  message: String;
  form: FormGroup;
  action: string;
  isRegister: boolean;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,

    public messageService: MessageService,
    private messageBarService: MessageBarService,
    private replyService: ReplyService,
    public auth: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.isRegister = !this.model.created;
    this.action = this.isRegister ?  '追加' : '更新';
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }


  createForm() {
    this.form = this.fb.group({
      text: ['', [
        Validators.required,
        Validators.maxLength(400),
      ]],
    });

    this.form.patchValue({
      text: this.model.text
    });
  }

  get text(): FormControl { return this.form.get('text') as FormControl; }

  // サブミット後にフォームをクリアするが
  // FormGroupのresetだけだとNgFormのsubmittedがクリアされないので
  // 引数としてNgFormオブジェクトをとりクリアする
  upsert(f: NgForm) {
    const form = this.form;
    if (!form.valid ) {
      return false;
    }

    this.model.text = form.value['text'];

    const action = this.isRegister
      ? this.replyService.register(this.model)
      : this.replyService.update(this.model);

    action.subscribe(
      this.onSuccess.bind(this, f),
      this.onValidationError.bind(this)
    );
  }

  private onSuccess(f: NgForm, res: any): void {
    this.snackBar.open(`リプライを${this.action}しました。`, null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
    this.complete.emit();
    this.form.reset();
    f.resetForm();
  }

  // TODO 共通化できるか検討
  private onValidationError(error: any): void {
    const noControlErrors = [];

    for (const e of error['errors']) {
      const control: FormControl | FormGroup = this[e.param];
      if (!control) {
        // 該当するfromがないものはスナックバーで表示
        noControlErrors.push(e);
        continue;
      }

      const messages = control.getError('remote');
      if (messages) {
        messages.push(e.msg);
      } else {
        control.setErrors({remote: [e.msg]});
      }
    }

    if (noControlErrors.length > 0) {
      this.messageBarService.showValidationError({errors: noControlErrors});
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
