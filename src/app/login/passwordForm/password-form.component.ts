import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

import { AuthenticationService } from '../../shared/services/authentication.service';
import { MessageService } from '../../shared/services/message.service';

import { UserModel } from '../../users/shared/user.model';


@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['../shared/form.component.scss']
})
export class PasswordFormComponent implements OnInit {
  @Output() complete = new EventEmitter();
  public form: FormGroup;

  static passwordMatchValidator(g: FormGroup) {
    const result = {};

    const oldPassword = g.get('oldPassword').value;
    const newPassword = g.get('newPassword').value;
    const newConfirmPassword = g.get('newConfirmPassword').value;

    if (newPassword && newPassword.length > 8
       && newConfirmPassword  && newConfirmPassword.length > 8
       && newPassword !== newConfirmPassword) {
      result['passwordMatch'] = true;
    }
    if (oldPassword && oldPassword.length > 8
       && newPassword  && newPassword.length > 8
       && oldPassword === newPassword) {
      result['changingPassowrd'] = true;
    }
    return result;
  }

  constructor(
    private auth: AuthenticationService,
    public messageService: MessageService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.createForm();
  }


  createForm() {
    const oldPassword = this.fb.control('', [
      Validators.required,
      Validators.minLength(8)
    ]);

    const newPassword = this.fb.control('', [
      Validators.required,
      Validators.pattern(MessageService.PATTERN_PASSWORD),
    ]);
    const newConfirmPassword = this.fb.control('', [
      Validators.required,
    ]);

    this.form = new FormGroup({
      oldPassword,
      newPassword,
      newConfirmPassword
    }, PasswordFormComponent.passwordMatchValidator);
  }

  get oldPassword(): FormControl { return this.form.get('oldPassword') as FormControl; }
  get newPassword(): FormControl { return this.form.get('newPassword') as FormControl; }
  get newConfirmPassword(): FormControl { return this.form.get('newConfirmPassword') as FormControl; }


  onSubmit() {
    if (this.form.invalid) {
      return;
    }


    this.auth
      .changePassword(this.form.value)
      .subscribe( (res: any) => {
        this.complete.emit();
      }, (error: any) => {
        for (const e of error['errors']) {
          // getterからformControllを取得
          const control: FormControl | FormGroup = this[e.param];
          if (!control) {
            return;
          }

          const messages = control.getError('remote');
          if (messages) {
            messages.push(e.msg);
          } else {
            control.setErrors({remote: [e.msg]});
          }
        }

      });
  }
}
