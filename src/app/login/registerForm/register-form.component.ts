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
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['../shared/form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  @Output() changeLoginMode = new EventEmitter();
  @Output() complete = new EventEmitter();
  public form: FormGroup;

  static passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
        ? null
        : {'passwordMatch': true};
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
    const userId = this.fb.control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
      Validators.pattern(MessageService.PATTERN_HANKAKUEISU),
    ]);
    const password = this.fb.control('', [
      Validators.required,
      Validators.pattern(MessageService.PATTERN_PASSWORD),
    ]);
    const confirmPassword = this.fb.control('', [
      Validators.required,
    ]);


    this.form = this.fb.group({
      userId: userId,
      passwordGroup: new FormGroup({ password, confirmPassword }, RegisterFormComponent.passwordMatchValidator)
    });
  }

  get userId(): FormControl { return this.form.get('userId') as FormControl; }
  get passwordGroup(): FormGroup { return this.form.get('passwordGroup') as FormGroup; }
    get password(): FormControl { return this.passwordGroup.get('password') as FormControl; }
    get confirmPassword(): FormControl { return this.passwordGroup.get('confirmPassword') as FormControl; }


  toRegister(): void {
    this.changeLoginMode.emit();
  }


  onSubmit() {
    if (this.form.invalid) {
      return;
    }


    this.auth
      .register({
        userId: this.userId.value,
        password: this.password.value,
        confirmPassword: this.confirmPassword.value,
      })
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
