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
import { UserModel } from '../../users/shared/user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../shared/form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() changeLoginMode = new EventEmitter();
  @Output() complete = new EventEmitter();
  message: String;
  loginForm: FormGroup;

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
    this.loginForm = this.fb.group({
      userId: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  get userId(): FormControl { return this.loginForm.get('userId') as FormControl; }
  get password(): FormControl { return this.loginForm.get('password') as FormControl; }

  hasError(validationName: string, control: FormControl): Boolean {
    return control.hasError(validationName) && control.dirty;
  }

  errorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || isSubmitted));
  }

  toLogin(): void {
    this.changeLoginMode.emit();
  }


  onSubmit(loginForm: FormGroup) {
    if (loginForm.invalid) {
      // TODO エラーメッセージ
      return;
    }

    this.auth
      .login({
        userId: loginForm.value['userId'],
        password: loginForm.value['password']
      } as UserModel)
      .subscribe( (res: any) => {
        if (res.success !== true) {
          this.message = res['message'];
          return;
        }
        this.complete.emit();
      });
  }
}
