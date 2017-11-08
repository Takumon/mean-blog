import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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
import { Subscription } from 'rxjs/Subscription';
import {
  MatSnackBar,
  MatDialog,
} from '@angular/material';

import { ImageService } from '../../shared/services/image.service';
import { MessageBarService } from '../../shared/services/message-bar.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { MessageService } from '../../shared/services/message.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ArticleModel } from '../shared/article.model';
import { ArticleService } from '../shared/article.service';
import { DraftModel } from '../shared/draft.model';
import { DraftService } from '../shared/draft.service';
import { EditMode } from './edit-mode.enum';

const IS_RESUME = 'resume';

// TODO 処理に分岐が多すぎるのでリファクタしたい
@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss'],
})
export class ArticleEditComponent implements OnInit {
  action: String;
  // 更新前の状態を保持する
  previousArticle: ArticleWithUserModel;
  previousDraft: DraftModel;
  queryparam_isResume: boolean;
  param_id: string;

  canRegisterDraft: Boolean = true;

  fileList: Array<any> = [];
  invalidFiles: Array<any> = [];
  images: Array<any> = [];




  MarkdownEditMode = EditMode;
  markdonwEditMode: String = EditMode[EditMode.harfPreviewing];
  form: FormGroup;


  @ViewChild('syncScrollTarget')
  scrollTarget: ElementRef;


  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public dialog: MatDialog,

    private messageBarService: MessageBarService,
    private imageService: ImageService,
    private articleService: ArticleService,
    public draftService: DraftService,
    private auth: AuthenticationService,
    private routeNamesService: RouteNamesService,
    public messageService: MessageService,
    ) {

  }

  ngOnInit(): void {
    this.createForm();

    this.route.queryParams
    .subscribe(queryParams => {
      this.queryparam_isResume = queryParams[IS_RESUME];

      this.route.params.subscribe( params => {
        this.param_id = params['_id'];

        this.init(this.queryparam_isResume, this.param_id);
      });

    });
  }


  // URLの情報を元に画面初期化する
  init(isResume: boolean, _id: string): void {
    if (isResume) {
      this.action = '更新';
      this.routeNamesService.name.next(`下書きを${this.action}する`);

      const withUser = true;
      this.draftService
      .getById(_id)
      .subscribe(draft => {
        this.previousDraft = draft;
        this.form.patchValue({
          title: draft.title,
          isMarkdown: draft.isMarkdown,
          body: draft.body,
        });

      });

    } else {
      // 記事を更新または登録する場合、下書きの上限件数を確認し
      // これ以上下書き保存できない場合は下書き保存できないようにする
      this.draftService.canRegisterDraft().subscribe(result => this.canRegisterDraft = result);

      if (_id) {
        this.action = '更新';

        this.draftService.get({ articleId: _id })
        .subscribe(drafts => {
          // TODO クライアントとサーバどちらでやるべきか
          if ( drafts && drafts.length > 1) {
            // TODO エラー処理　データ不整合
            console.log('データ不整合。記事にひもづく下書きが２件以上存在する。');
            console.log(drafts);
            return;
          }

          // すでに下書きがある場合は下書きがインプット
          if (drafts && drafts.length === 1) {
            this.previousDraft = drafts[0];
            this.form.patchValue({
              title: drafts[0].title,
              isMarkdown: drafts[0].isMarkdown,
              body: drafts[0].body,
            });
            // 下書き保存ボタンの設定を戻す
            this.canRegisterDraft = true;
            this.snackBar.open('編集中の下書きがあるのでそれを編集します。', null, {duration: 3000});
            this.routeNamesService.name.next(`下書きを${this.action}する`);
            return;
          }

          // まだ下書きがない場合は記事がインプット
          this.routeNamesService.name.next(`記事を${this.action}する`);

          this.articleService
          .getOne(_id, true)
          .subscribe(article => {
            this.previousArticle = article as ArticleWithUserModel;
            this.form.patchValue({
              title: article.title,
              isMarkdown: article.isMarkdown,
              body: article.body,
            });
          });
        });

      } else {
        this.action = '投稿';
        this.routeNamesService.name.next(`記事を${this.action}する`);
        this.form.patchValue({
          isMarkdown: true,
        });
      }
    }
  }

  createForm() {
    this.form = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.maxLength(100),
      ]],
      isMarkdown: '',
      body: ['', [
        Validators.required,
        Validators.maxLength(10000),
      ]],
    });
  }

  get title(): FormControl { return this.form.get('title') as FormControl; }
  get body(): FormControl { return this.form.get('body') as FormControl; }
  get isMarkdown(): FormControl { return this.form.get('isMarkdown') as FormControl; }

  hasError(validationName: string, control: FormControl): Boolean {
    return control.hasError(validationName) && control.dirty;
  }

  errorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || isSubmitted));
  }


  isNew(): boolean {
    return !this.previousArticle;
  }

  @HostListener('scroll', ['$event'])
  private syncScroll($event: Event): void {
    const scrollAreaHight = $event.srcElement.scrollHeight - $event.srcElement.clientHeight;
    const ratio = ($event.srcElement.scrollTop / scrollAreaHight);

    const target = this.scrollTarget.nativeElement;
    target.scrollTop = (target.scrollHeight - target.clientHeight) * ratio;
  }

  // 記事保存
  upsertArticle(form: FormGroup): void {
    if (!form.valid ) {
      return;
    }

    const article = new ArticleModel();
    article.title = form.value['title'];
    article.isMarkdown = form.value['isMarkdown'];
    article.body = form.value['body'];

    if (this.previousDraft) {
      // TODO トランザクション
      // 公開した記事の下書きの場合は記事を更新
      if (this.previousDraft.posted) {
        article._id = this.previousDraft.articleId;
        this.articleService
        .update(article)
        .subscribe((resOfModifiedArticle: any) => {
          // 記事を登録したら下書きは削除する
          this.draftService
          .delete(this.previousDraft._id)
          .subscribe(r => {
            this.snackBar.open('記事を更新しました。', null, {duration: 3000});
            this.goToArticle(resOfModifiedArticle.obj._id);
          }, this.messageBarService.showValidationError.bind(this.messageBarService));
        }, this.onValidationError.bind(this));
      } else {
        // 未公開の場合は記事を登録
        article.author = this.previousDraft.author;
        this.articleService
        .register(article)
        .subscribe((resOfModifiedArticle: any) => {
          // 記事を登録したら下書きは削除する
          this.draftService
          .delete(this.previousDraft._id)
          .subscribe(r => {
            this.snackBar.open('記事を登録しました。', null, {duration: 3000});
            this.goToArticle(resOfModifiedArticle.obj._id);
          }, this.messageBarService.showValidationError.bind(this.messageBarService));
        }, this.onValidationError.bind(this));
      }

    } else {
      if (this.previousArticle) {
        // 記事　=> 記事　記事更新
        article._id = this.previousArticle._id;

        this.articleService
          .update(article)
          .subscribe((res: any) => {
            this.snackBar.open('記事を更新しました。', null, {duration: 3000});
            this.goToArticle(res.obj._id);
          }, this.onValidationError.bind(this));
      } else {
        // 記事登録
        article.author = this.auth.loginUser._id;

        this.articleService
          .register(article)
          .subscribe((res: any) => {
            this.snackBar.open('記事を登録しました。', null, {duration: 3000});
            this.goToArticle(res.obj._id);
          }, this.onValidationError.bind(this));
      }
    }
  }

  /**
   * 入力チェック時の共通エラーハンドリング用関数(<b>bindして使用する<b>)<br>
   * bind先は入力チェックkeyと同名のコントローラのgetterを定義すること<br>
   * getterで入力チェックに対応するコントローラが取得できない場合はsnackBarでエラーメッセージを表示する
   */
  onValidationError(error: any): void {
    const noControlErrors = [];
    for (const e of error['errors']) {
      // getterからformControllを取得
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

  // 下書き保存
  upsertDraft(form: FormGroup): void {
    // もともと下書きだった場合は更新
    if (this.previousDraft) {
      const draft = new DraftModel();
      draft._id = this.previousDraft._id;
      draft.title = form.value['title'];
      draft.isMarkdown = form.value['isMarkdown'];
      draft.body = form.value['body'];

      this.draftService
        .update(draft)
        .subscribe((res: any) => {
          this.snackBar.open('下書きを更新しました。', null, {duration: 3000});
          this.goToDraft(res.obj._id);
        }, this.onValidationError.bind(this));
    } else {
      // それ以外の場合は新規登録
      const draft = new DraftModel();
      draft.author = this.auth.loginUser._id;
      draft.title = form.value['title'];
      draft.isMarkdown = form.value['isMarkdown'];
      draft.body = form.value['body'];

      // 公開済みの記事を下書き保存する場合
      if (this.previousArticle) {
        draft.articleId = this.previousArticle._id;
        draft.posted = true;
      }

      this.draftService
        .create(draft)
        .subscribe((res: any) => {
          this.snackBar.open('下書きを保存しました。', null, {duration: 3000});
          this.goToDraft(res.obj._id);
        }, this.onValidationError.bind(this));
    }
  }

  cancel(isChanged: boolean): void {
    if (isChanged) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: '確認',
          message: `入力内容が破棄されます。よろしいですか？`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }

        this.goBack();
      });
    } else {
      this.goBack();
    }
  }

  private goBack(): void {
    // 下書きの場合
    if (this.queryparam_isResume) {
      this.goToDraft(this.previousDraft._id);
    } else if (this.param_id) {
      // 既存記事更新の場合
      this.goToArticle(this.previousArticle._id);
    } else {
      // 記事新規登録の場合
      this.router.navigate(['/']);
    }
  }


  private goToDraft(_id: string) {
    this.router.navigate(['drafts', _id]);
  }

  private goToArticle(_id: string) {
    this.router.navigate([`${this.auth.loginUser.userId}`, 'articles', _id]);
  }

  onFilesChange(fileList: Array<File>)　{
    this.fileList = fileList;


    // TODO 複数件アップロード
    this.imageService.create(fileList[0])
    .subscribe((res: any) => {
      this.snackBar.open('画像をアップロードしました。', null, {duration: 3000});
      this.images.push(JSON.parse(res._body).obj._id);
    }, this.onValidationError.bind(this));
  }

  onFileInvalids(fileList: Array<File>)　{
    this.invalidFiles = fileList;
  }

}
