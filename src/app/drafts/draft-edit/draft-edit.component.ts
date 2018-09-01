import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormGroupDirective,
  FormControl,
  FormArray,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  MatDialog,
} from '@angular/material';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { Constant } from '../../shared/constant';
import { ConfirmDialogComponent } from '../../shared/components';
import {
  AuthenticationService,
  MessageService,
  MessageBarService,
  ImageService,
  ArticleService,
} from '../../shared/services';

import {
  ArticleModel,
  ArticleWithUserModel,
} from '../../shared/models';

import {
  DraftService,
} from '../shared';
import { DraftModel } from '../state/draft.model';

import * as fromDraft from '../state';


import { EditMode } from './draft-edit-mode.enum';
import {
  DraftActionTypes,
  AddDraftFail,
  AddDraft,
  UpdateDraft,
  UpdateDraftFail,
  DeleteDraft,
  DeleteDraftFail,
} from '../state/draft.actions';
import { SetTitle, ShowSnackbar } from '../../state/app.actions';
import {
  AddArticle,
  AddArticleFail,
  ArticleActionTypes,
  UpdateArticle,
  UpdateArticleFail,
  AddArticleSuccess,
  UpdateArticleSuccess,
  DeleteArticleSuccess,
  LoadArticleSuccess
} from '../../state/article.actions';
import { DraftEditAreaComponent } from './draft-edit-area.component';


const IS_RESUME = 'resume';

// TODO 処理に分岐が多すぎるのでリファクタしたい
@Component({
  selector: 'app-draft-edit',
  templateUrl: './draft-edit.component.html',
  styleUrls: ['./draft-edit.component.scss'],
})
export class DraftEditComponent implements OnInit, OnDestroy {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  @ViewChild('mdTextArea') $mdTextArea;

  action: String;
  // 更新前の状態を保持する
  previousArticle: ArticleWithUserModel;
  previousDraft: DraftModel;
  queryparam_isResume: boolean;
  param_id: string;

  canRegisterDraft: Boolean = true;

  imageForDisplayList: Array<any> = [];

  /** キャレット開始位置（マークダウン入力補助のため）*/
  caretPosStart = 0;
  /** キャレット終了位置（マークダウン入力補助のため）*/
  caretPosEnd = 0;

  /** 画像一覧領域を表示するか */
  isImageOperationShow = true;

  MarkdownEditMode = EditMode;
  markdonwEditMode: String = EditMode[EditMode.harfPreviewing];
  form: FormGroup;

  private onDestroy = new Subject();

  @ViewChild('syncScrollTarget')
  scrollTarget: ElementRef;

  @ViewChild(DraftEditAreaComponent)
  draftEditAreaComponent: DraftEditAreaComponent;


  constructor(
    private router: Router,
    private actions$: Actions,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private store: Store<fromDraft.State>,

    private messageBarService: MessageBarService,
    private imageService: ImageService,
    private articleService: ArticleService,
    public draftService: DraftService,
    private auth: AuthenticationService,
    public messageService: MessageService,
  ) {
    // エラーメッセージ表示処理を登録
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<AddDraftFail>(DraftActionTypes.AddDraftFail),
      tap(action => this.onValidationError(action.payload.error))
    ).subscribe();

    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<UpdateDraftFail>(DraftActionTypes.UpdateDraftFail),
      tap(action => this.onValidationError(action.payload.error))
    ).subscribe();

    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<DeleteDraftFail>(DraftActionTypes.DeleteDraftFail),
      tap(action => this.onValidationError(action.payload.error))
    ).subscribe();


    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<AddArticleFail>(ArticleActionTypes.AddArticleFail),
      tap(action => this.onValidationError(action.payload.error))
    ).subscribe();

    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<UpdateArticleFail>(ArticleActionTypes.UpdateArticleFail),
      tap(action => this.onValidationError(action.payload.error))
    ).subscribe();


    // URLのユーザー名と取得した記事のユーザ名が一致しない場合は
    // 正しいURLにリダイレクトする
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<LoadArticleSuccess>(ArticleActionTypes.LoadArticleSuccess),
      tap(action => {
        const article = action.payload.article;

        this.route.params.subscribe( params => {
          if (params['userId'] !== article.author.userId) {
            this.router.navigate(['/', article.author, 'articles', article._id]);
          }
        });
      })
    ).subscribe();

    // 画面遷移処理
    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<AddArticleSuccess>(ArticleActionTypes.AddArticleSuccess),
      tap(action => this.router.navigate([`${this.auth.loginUser.userId}`, 'articles', action.payload.article._id]))
    ).subscribe();

    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<UpdateArticleSuccess>(ArticleActionTypes.UpdateArticleSuccess),
      tap(action => this.router.navigate([`${this.auth.loginUser.userId}`, 'articles', action.payload.article.id]))
    ).subscribe();

    this.actions$.pipe(
      takeUntil(this.onDestroy),
      ofType<DeleteArticleSuccess>(ArticleActionTypes.DeleteArticleSuccess),
      tap(action => this.router.navigate(['/']))
    ).subscribe();
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

  ngOnDestroy() {
    this.onDestroy.next();
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
      // bodyは子コンポーネントで定義
      image: this.fb.array([]),
    });
  }

  get title(): FormControl { return this.form.get('title') as FormControl; }
  get body(): FormControl { return this.form.get('body') as FormControl; }
  get isMarkdown(): FormControl { return this.form.get('isMarkdown') as FormControl; }
  get image(): FormArray { return this.form.get('image') as FormArray; }



  // URLの情報を元に画面初期化する
  init(isResume: boolean, _id: string): void {
    if (isResume) {
      this.action = '更新';
      this.store.dispatch(new SetTitle({title: `下書きを${this.action}する`}));

      this.draftService
      .getById(_id)
      .subscribe(draft => {
        this.previousDraft = draft;
        this.form.patchValue({
          title: draft.title,
          isMarkdown: draft.isMarkdown,
          body: draft.body,
        });

        if (draft.image && draft.image.length > 0) {
          draft.image.forEach(i => this.image.push(new FormControl(i._id)));
        }
        this.imageForDisplayList = draft.image || [];

      });

    } else {
      // 記事を更新または登録する場合、下書きの上限件数を確認し
      // これ以上下書き保存できない場合は下書き保存できないようにする
      this.draftService.canRegisterDraft(this.auth.loginUser._id)
      .subscribe(result => this.canRegisterDraft = result);

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
            const draft = drafts[0];
            this.previousDraft = draft;
            this.form.patchValue({
              title: draft.title,
              isMarkdown: draft.isMarkdown,
              body: draft.body,
              image: draft.image && draft.image.length > 0 ? draft.image.map(i => i._id) : [],
            });

            if (draft.image && draft.image.length > 0) {
              draft.image.forEach(i => this.image.push(new FormControl(i._id)));
            }
            this.imageForDisplayList = draft.image || [];

            // 下書き保存ボタンの設定を戻す
            this.canRegisterDraft = true;
            this.store.dispatch(new ShowSnackbar({
              message: '編集中の下書きがあるのでそれを編集します。',
              action: null,
              config: this.Constant.SNACK_BAR_DEFAULT_OPTION
            }));
            this.store.dispatch(new SetTitle({title: `下書きを${this.action}する`}));

            return;
          }

          // まだ下書きがない場合は記事がインプット
          this.store.dispatch(new SetTitle({title: `記事を${this.action}する`}));

          this.articleService
          .getById(_id, true)
          .subscribe(article => {
            this.previousArticle = article as ArticleWithUserModel;
            this.form.patchValue({
              title: article.title,
              isMarkdown: article.isMarkdown,
              body: article.body,
              image: article.image && article.image.length > 0 ? article.image.map(i => i._id) : [],
            });

            if (article.image && article.image.length > 0) {
              article.image.forEach(i => this.image.push(new FormControl(i._id)));
            }
            this.imageForDisplayList = article.image || [];
          });
        });

      } else {
        this.action = '投稿';
        this.store.dispatch(new SetTitle({title: `記事を${this.action}する`}));
        this.form.patchValue({
          isMarkdown: true,
        });
      }
    }
  }

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

  /**
   * テキストエリアスクロールにあわせて表示領域もスクロールさせる.
   */
  onScroll({ ratio }): void {
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
    article.image = form.value['image'];

    if (this.previousDraft) {
      // TODO トランザクション
      // 公開した記事の下書きの場合は記事を更新
      if (this.previousDraft.articleId) {
        article._id = this.previousDraft.articleId;

        // TODO 記事更新と下書き削除は１トランにまとめる
        this.store.dispatch(new UpdateArticle({
          article: {
            id: article._id,
            changes: article
          }
        }));

        this.store.dispatch(new DeleteDraft({
          id: this.previousDraft._id
        }));

      } else {
        // 未公開の場合は記事を登録
        article.author = this.previousDraft.author;
        this.store.dispatch(new AddArticle({ article }));
      }

    } else {
      if (this.previousArticle) {
        // 記事　=> 記事　記事更新
        article._id = this.previousArticle._id;

        this.store.dispatch(new UpdateArticle({
          article: {
            id: article._id,
            changes: article
          }
        }));

      } else {
        // 記事登録
        article.author = this.auth.loginUser._id;
        this.store.dispatch(new AddArticle({ article }));
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
        // 該当するControlFormがないものはスナックバーで表示
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

      this.store.dispatch(new UpdateDraft({
        draft: {
          id: this.previousDraft._id,
          changes: {
            title: form.value['title'],
            isMarkdown: form.value['isMarkdown'],
            body: form.value['body'],
          }
        }
      }));

    } else {
      // それ以外の場合は新規登録
      const draft = new DraftModel();
      draft.isMarkdown = form.value['isMarkdown'];
      draft.author = this.auth.loginUser._id;
      draft.title = form.value['title'];
      draft.body = form.value['body'];

      // 公開済みの記事を下書き保存する場合
      if (this.previousArticle) {
        draft.articleId = this.previousArticle._id;
      }

      this.store.dispatch(new AddDraft({ draft }));
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

  /**
   * 画像を削除する
   */
  deleteImage(image) {
    this.imageService.delete(image._id).subscribe(() => {
      this.draftEditAreaComponent.onDeleteImage(image);
      this.imageForDisplayList = this.imageForDisplayList.filter(i => i !== image);

      // 一番最初の画像を削除
      const ｃ = this.image.controls;
      const len = ｃ.length;
      for (let i = 0; i < len; i++ ) {
        if (ｃ[i].value === image._id) {
          this.image.removeAt(i);
          break;
        }
      }
    });
  }

  /**
   * 添付ファイル変更時.
   * TODO 複数件アップロード
   */
  onFilesChange(fileList: Array<File>)　{
    this.imageService.register(fileList[0])
      .subscribe((res: any) => {

        const image = res.obj;
        this.imageForDisplayList.push({
          _id: image._id,
          fileName: image.fileName,
        });
        this.image.push(new FormControl(image._id));

        this.draftEditAreaComponent.insertImageToArticle(image);

        this.store.dispatch(new ShowSnackbar({
          message: '画像をアップロードしました。',
          action: null,
          config: this.Constant.SNACK_BAR_DEFAULT_OPTION
        }));


      }, this.onValidationError.bind(this));
  }
}
