import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { Constant } from '../shared/constant';
import { AuthenticationService } from '../shared/services/authentication.service';
import { RouteNamesService } from '../shared/services/route-names.service';
import { MessageService } from '../shared/services/message.service';
import { MessageBarService } from '../shared/services/message-bar.service';

import { UserModel } from './shared/user.model';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  public user: UserModel;
  public editMode: Boolean = false;
  public form: FormGroup;
  public avatorForPreview: string;
  public profileBackgroundForPreview: string;

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
    private messageBarService: MessageBarService,
    public auth: AuthenticationService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.routeNamesService.name.next('');
    this.route.params
    .pipe(takeUntil(this.onDestroy))
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

  isMine(): boolean {
    if (!this.auth.isLogin()) {
      return false;
    }
    return  this.user._id === this.auth.loginUser._id;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const val = this.form.value;
    const model = new UserModel();
    model._id = this.user._id;
    model.blogTitle = val.blogTitle;
    model.email = val.email;
    model.userDescription = val.userDescription;
    model.userName = val.userName;



    this.userService
      .update(model, val.avator, val.profileBackground)
      .subscribe((res: any) => {
        this.snackBar.open('プロフィールを編集しました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
        this.getUser(this.param_userId);
        this.cancelEdit();
      }, this.onValidationError.bind(this));
  }

    // TODO 共通化できるか検討
  private onValidationError(error: any): void {
    const noControlErrors = [];

    for (const e of error['errors']) {
      const control: FormControl | FormGroup = this[e.param];
      // 画像に対するエラーはメッセージだけ表示する
      if (e.param === 'avator' || e.param === 'profileBackground' || !control) {
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

  cancelEdit(): void {
    this.editMode = false;
    this.form = null;
    this.avatorForPreview = null;
    this.profileBackgroundForPreview = null;
  }

  editUser(): void {
    this.createForm(this.user);
    this.editMode = true;
  }

  createForm(user: UserModel) {
    this.form = this.fb.group({
      _id: '',
      userId: [{value: '', disabled: true}],
      userName: ['', [
        Validators.maxLength(50),
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
      avator: '',
      profileBackground: '',
    });

    this.form.patchValue(user);
  }

  onChangeAvatorFile(event): void {
    const file = event.srcElement.files[0];
    this.avator.setValue(file);
    this.getBase64(file, base64File => {
      this.avatorForPreview = base64File;
    });
  }

  onChangeBackgroundFile(event): void {
    const file = event.srcElement.files[0];
    this.profileBackground.setValue(file);
    this.getBase64(file, base64File => {
      this.profileBackgroundForPreview = base64File;
    });
  }

  getBase64(file: File, callback: Function) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64File = e.target.result;
      if (callback) {
        callback(base64File);
      }
    };
    reader.readAsDataURL(file);
  }

  get userName(): FormControl { return this.form.get('userName') as FormControl; }
  get email(): FormControl { return this.form.get('email') as FormControl; }
  get blogTitle(): FormControl { return this.form.get('blogTitle') as FormControl; }
  get userDescription(): FormControl { return this.form.get('userDescription') as FormControl; }
  get avator(): FormControl { return this.form.get('avator') as FormControl; }
  get profileBackground(): FormControl { return this.form.get('profileBackground') as FormControl; }
}
