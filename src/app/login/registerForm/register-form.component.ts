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
  styleUrls: ['../shared/form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  @Output() changeLoginMode = new EventEmitter();
  @Output() complete = new EventEmitter();
  message: String;
  form: FormGroup;

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
      Validators.pattern(MessageService.PATTERN_PASSWORD),
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


  hasError(validationName: string, control: FormControl | FormGroup): Boolean {
    return control.hasError(validationName) && control.dirty;
  }

  errorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || isSubmitted));
  }

  // 親グループも含めてチェック
  errorStateMatcherContainParentGroup(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control.invalid || control.parent.invalid) && (control.dirty || isSubmitted);
  }

  toRegister(): void {
    this.changeLoginMode.emit();
  }


  onSubmit(form: FormGroup) {
    if (form.invalid) {
      return;
    }


    this.auth
      .register({
        userId: form.value.userId,
        password: form.value.passwordGroup.password
      } as UserModel)
      .subscribe( (res: any) => {
        this.complete.emit();
      }, (error: any) => {
        const errors = error['errors'];
        Object.keys(errors).forEach(formName => {
          // getterからformControllを取得
          const control: FormControl = this[formName];
          if (!control) {
            return;
          }

          control.setErrors({remote: errors[formName]});
        });

      });
  }
}
