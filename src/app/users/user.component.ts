import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
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

import { AuthenticationService } from '../shared/services/authentication.service';
import { RouteNamesService } from '../shared/services/route-names.service';
import { MessageService } from '../shared/services/message.service';

import { UserModel } from './shared/user.model';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  public user: UserModel;
  public isMine: Boolean;
  public editMode: Boolean = false;
  public form: FormGroup;
  /** routerLink変更時にUI(アクティブなタブ)をリフレッシュするためのダミーオブジェクト */
  public routerOptions: any = { exact: true };

  private onDestroy = new Subject();
  private param_userId: string;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,

    private route: ActivatedRoute,
    private routeNamesService: RouteNamesService,
    public messageService: MessageService,
    private auth: AuthenticationService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next('');
    this.route.params
    .takeUntil(this.onDestroy)
    .subscribe( params => {
      this.param_userId = params['_userId'];
      this.getUser(this.param_userId);
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }


  private getUser(userId: string): void {
    this.userService.getById(userId).subscribe(user => {
      this.isMine = user._id === this.auth.loginUser._id;
      this.user = user as UserModel;
      // ユーザ変更後、タブのrouterLinkが変わるので
      // それに合わせてアクティブタブをリフレッシュするため
      // routerOptionsの値を変更してリフレッシュをトリガーする
      // あえてオブジェクトの参照を変えるためオブジェクトを代入している
      this.routerOptions = {
        exact : true
      };
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.userService
      .update(this.form.value)
      .subscribe((res: any) => {
        this.snackBar.open('プロフィールを編集しました。', null, {duration: 3000});
        this.getUser(this.param_userId);
        this.editMode = false;
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

  cancelEdit(): void {
    this.editMode = false;
    this.form = null;
  }

  editUser(): void {
    this.createForm(this.user);
    this.editMode = true;
  }

  createForm(user: UserModel) {
    this.form = this.fb.group({
      _id: '',
      userId: [{value: '', disabled: true}],
      firstName: ['', [
        Validators.maxLength(30),
      ]],
      lastName: ['', [
        Validators.maxLength(30),
      ]],
      email: ['', [
        Validators.maxLength(50),
        Validators.pattern(MessageService.PATTERN_EMAIL),
      ]],
      blogTitle: ['', [
        Validators.maxLength(30),
      ]],
      userDescription: ['', [
        Validators.maxLength(400),
      ]],
      icon: '',
      blogTitleBackground: '',
    });

    this.form.patchValue(user);
  }

  onChangeIconFile(event): void {
    const file = event.srcElement.files[0];
    this.getBase64(file, base64File => {
      this.icon.setValue(base64File);
    });
  }

  onChangeBackgroundFile(event): void {
    const file = event.srcElement.files[0];
    this.getBase64(file, base64File => {
      this.blogTitleBackground.setValue(base64File);
    });
  }

  getBase64(file: File, callback: Function) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64File = e.target.result;
      const withoutMediaType = base64File.split(',')[1];
      if (callback) {
        callback(withoutMediaType);
      }
    };
    reader.readAsDataURL(file);
  }

  get firstName(): FormControl { return this.form.get('firstName') as FormControl; }
  get lastName(): FormControl { return this.form.get('lastName') as FormControl; }
  get email(): FormControl { return this.form.get('email') as FormControl; }
  get blogTitle(): FormControl { return this.form.get('blogTitle') as FormControl; }
  get userDescription(): FormControl { return this.form.get('userDescription') as FormControl; }
  get icon(): FormControl { return this.form.get('icon') as FormControl; }
  get blogTitleBackground(): FormControl { return this.form.get('blogTitleBackground') as FormControl; }
}
