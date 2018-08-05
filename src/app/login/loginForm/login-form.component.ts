import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';


import {
  AuthenticationService,
  MessageService,
} from '../../shared/services';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../shared/form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() changeLoginMode = new EventEmitter();
  @Output() complete = new EventEmitter();
  public form: FormGroup;

  constructor(
    public messageService: MessageService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.createForm();
  }


  createForm() {
    this.form = this.fb.group({
      userId: ['', [
        Validators.required,
      ]],
      password: ['', [
        Validators.required,
      ]]
    });
  }

  get userId(): FormControl { return this.form.get('userId') as FormControl; }
  get password(): FormControl { return this.form.get('password') as FormControl; }


  toLogin(): void {
    this.changeLoginMode.emit();
  }


  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.auth
      .login({
        userId: this.userId.value,
        password: this.password.value
      })
      .subscribe( (res: any) => {
        this.complete.emit();
      }, (error: any) => {
        for (const e of error['errors']) {
          // getterからformControllを取得
          const control: FormControl | FormGroup = e.param === 'common' ? this.form : this[e.param];
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
