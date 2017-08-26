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
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  @Output() changeLoginMode = new EventEmitter();
  @Output() complete = new EventEmitter();
  message: String;
  registerForm: FormGroup;

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
    // TODO 相関チェック
    this.registerForm = this.fb.group({
      userId: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
    });
  }

  get userId() { return this.registerForm.get('userId'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }


  hasError(validationName: string, control: FormControl): Boolean {
    return control.hasError(validationName) && control.dirty;
  }

  errorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || isSubmitted));
  }

  toRegister(): void {
    this.changeLoginMode.emit();
  }


  onSubmit(registerForm: FormGroup) {
    if (registerForm.invalid) {
      return;
    }


    this.auth
      .register({
        userId: registerForm.value['userId'],
        password: registerForm.value['password']
      } as UserModel)
      .subscribe( (res: any) => {
        if (res.success !== true) {
          this.message = res['message'];
          return;
        }

        this.auth.setLoginUser(res.user);
        this.complete.emit();
      });
  }
}
