import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
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
  MatSnackBar,
  MatDialog,
} from '@angular/material';

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

import { Store } from '@ngrx/store';
import * as fromDraft from '../state';


import { EditMode } from './draft-edit-mode.enum';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import {
  DraftActionTypes,
  AddDraftFail,
  AddDraft,
  UpdateDraft,
  UpdateDraftFail,
  DeleteDraft,
  DeleteDraftFail,
} from '../state/draft.actions';
import { SetTitle } from '../../state/app.actions';
import { AddArticle, AddArticleFail, ArticleActionTypes, UpdateArticle, UpdateArticleFail } from '../../state/article.actions';


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
  public isImageOperationShow = true;



  MarkdownEditMode = EditMode;
  markdonwEditMode: String = EditMode[EditMode.harfPreviewing];
  form: FormGroup;

  private onDestroy = new Subject();

  @ViewChild('syncScrollTarget')
  scrollTarget: ElementRef;


  constructor(
    private snackBar: MatSnackBar,
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
            this.snackBar.open('編集中の下書きがあるのでそれを編集します。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
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
      draft.author = this.auth.loginUser._id;
      draft.title = form.value['title'];
      draft.isMarkdown = form.value['isMarkdown'];
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

  deleteImage(image) {
    this.imageService.delete(image._id).subscribe((res: any) => {
      const escapedImage = image.fileName.replace(/\./g, '\\.');
      const imageStatement = `\\!\\[${escapedImage}\\]\\(api\\/images\\/ofArticle\\/${image._id}\\)`;
      // テキストエリアから画像宣言部分を削除する
      // 複数定義している場合を考慮してグローバルマッチにしている
      this.body.setValue(this.body.value.replace(new RegExp(imageStatement, 'g'), ''));
      this.imageForDisplayList = this.imageForDisplayList.filter(i => i !== image);

      const controls = this.image.controls;
      const len = controls.length;
      for (let i = 0; i < len; i++ ) {
        if (controls[i].value === image._id) {
          this.image.removeAt(i);
          break;
        }
      }

    });
  }

  onFilesChange(fileList: Array<File>)　{


    // TODO 複数件アップロード
    this.imageService.register(fileList[0])
    .subscribe((res: any) => {
      this.snackBar.open('画像をアップロードしました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
      const image = res.obj;
      this.imageForDisplayList.push({
        _id: image._id,
        fileName: image.fileName,
      });
      this.image.push(new FormControl(image._id));

      this.insertImageToArticle(image);
    }, this.onValidationError.bind(this));
  }

  insertImageToArticle(image) {
    const imageStatement = `\n![${image.fileName}](api/images/ofArticle/${image._id})\n`;
    this.insertText(imageStatement, this.caretPosStart);
  }


  /**
   * 指定したプレフィックスとサフィックスを指定した位置に挿入する
   *
   * @param preffix プレフィックス
   * @param positionForPreffix プレフィックス挿入位置
   * @param suffix サフィックス
   * @param positionForSuffix サフィックス挿入位置
   */
  insertPreffixAndSuffix(preffix: string, positionForPreffix: number, suffix: string, positionForSuffix: number) {
    const value = this.body.value;

    const inserted = value.substring(0, positionForPreffix)
                     + preffix + value.substring(positionForPreffix, positionForSuffix) + suffix
                     + value.substring(positionForSuffix, value.length);

    this.body.setValue(inserted);
  }

  /**
   * 指定したテキストを現在キャレットがある行の冒頭に挿入する
   *
   * @param text 挿入するテキスト
   */
  insertToLineStart(text: string) {
    // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
    const previouseCaretPosStart = this.caretPosStart;
    const previouseCaretPosEnd = this.caretPosEnd;

    this.insertText(text, this.searchCurrentLineStartIndex());
    this.moveCaretPosition(previouseCaretPosStart + text.length, previouseCaretPosEnd + text.length);
  }

  /**
   * 現在キャレットがある行冒頭のポジションを取得する
   *
   * @return キャレットポジション(デフォルトは現在キャレットポジション)
   */
  searchCurrentLineStartIndex(caretPosStart: number = this.caretPosStart): number {
    const value = this.body.value;
    // 遡って行末の改行を探す

    // テキストがない場合は最初が行冒頭とみなす
    if (value.length === 0) {
      return 0;
    }

    for (let i = caretPosStart - 1; i > 0; i--) {
      if (value[i] === '\n') {
        return i + 1;
      }
    }
    return 0;
  }

  /**
   * 指定したテキストを指定した位置に挿入する
   *
   * @param text 挿入するテキスト
   * @param position 挿入位置
   */
  insertText(text: string, position: number) {
    const value = this.body.value;

    const inserted = value.substring(0, position)
                    + text
                    + value.substring(position, value.length);

    this.body.setValue(inserted);
  }


  /**
   * 現在のキャレットポジションをずらす<br>
   * 範囲選択したくない場合は開始位置と終了位置に同じ値を指定する
   *
   * @param start 開始位置
   * @param end 終了位置
   */
  moveCaretPosition(start: number, end: number) {
    const elem = this.$mdTextArea.nativeElement;
    elem.focus();
    elem.setSelectionRange(start, end);
  }

  /**
   * テキストエリアのキャレット位置を保存する
   *
   * ＠param textareaElement テキストエリアのDOM要素
   */
  saveCaretPos(textareaElement) {
    if (textareaElement.selectionStart || textareaElement.selectionStart === 0) {
      this.caretPosStart = textareaElement.selectionStart;
      this.caretPosEnd = textareaElement.selectionEnd;
    }
  }

  /**
   * 指定したキャレットがある行がリスト形式か判断する
   *
   * @param caretPosition キャレットポジション(デフォルトは現在のキャレットポジション)
   */
  extractListInfo(caretPosition: number = this.caretPosStart): {isListLine: boolean, indent?: string} {
    const lineStartIndex = this.searchCurrentLineStartIndex(caretPosition);

    const temp = this.body.value.substring(lineStartIndex);
    const taregetLine = temp.substring(0, temp.indexOf('\n') === -1 ? temp.length : temp.indexOf('\n'));
    const listLinePattern = /^(\s*)\*\s/;

    const isListLine = listLinePattern.test(taregetLine);
    const result = {isListLine};

    if (isListLine) {
      result['indent'] = taregetLine.match(listLinePattern)[1];
    }
    return result;
  }

  /**
   * タブやエンター押下時に必要に応じてインデント調整やリスト形式にフォーマットしたりする
   */
  textFormat($event) {
    if ($event.keyCode === 9) {
      $event.preventDefault();
      this.adjustIndent($event);
      return;
    }

    // 前行がリスト形式であれば、自動でインデントしてリスト形式にする
    if ($event.keyCode === 13) {
      const startIndexOfCurrentLine = this.searchCurrentLineStartIndex();
      const listInfoOfCurrentLine = this.extractListInfo();

      if (!listInfoOfCurrentLine.isListLine) {
        return;
      }

      // キャレットが行冒頭にある場合は通常のEnterを押した時の挙動と同じにする
      if (startIndexOfCurrentLine <= this.caretPosStart
          &&  this.caretPosStart < startIndexOfCurrentLine + listInfoOfCurrentLine.indent.length + 2
        ) {
        return;
      }

      // ブラウザデフォルト処理を抑止し改行も本処理で挿入する
      $event.preventDefault();
      const listLinePreffix = '\n' + listInfoOfCurrentLine.indent + '* ';
      this.insertContentToCaretPosition(listLinePreffix, '');
    }
  }

  /**
   * タブ押下時にテキストをフォーマットする
   */
  adjustIndent($event) {
    const TAB = '    ';
    // インデントを追加
    if (!$event.shiftKey) {
      if (this.extractListInfo().isListLine) {
        return this.insertContentToCurrentLineStart(TAB);
      } else {
        return this.insertContentToCaretPosition(TAB, '');
      }
    }

    // インデントを削除
    if (this.extractListInfo().isListLine) {
      // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
      const previouseCaretPosStart = this.caretPosStart;
      const previouseCaretPosEnd = this.caretPosEnd;
      const lineStartIndex = this.searchCurrentLineStartIndex();

      const first4Charactor = this.body.value.substring(lineStartIndex, lineStartIndex + 4);
      const indent  = first4Charactor.match(/^\s*/)[0];
      const indentRemoved = first4Charactor.replace(/^\s*/, '');

      const removed = this.body.value.substring(0, lineStartIndex)
                    + indentRemoved
                    + this.body.value.substring(lineStartIndex + 4);

      this.body.setValue(removed);
      this.moveCaretPosition(previouseCaretPosStart - indent.length, previouseCaretPosEnd - indent.length);
      return;
    }

    if (this.caretPosStart >= 4
      && TAB === this.body.value.substring(this.caretPosStart - 4, this.caretPosStart)) {

      // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
      const previouseCaretPosStart = this.caretPosStart;
      const previouseCaretPosEnd = this.caretPosEnd;

      const removed = this.body.value.substring(0, this.caretPosStart - TAB.length)
                    + this.body.value.substring(this.caretPosStart);

      this.body.setValue(removed);
      this.moveCaretPosition(previouseCaretPosStart - TAB.length, previouseCaretPosEnd - TAB.length);
    }
  }


  /**
   * テキストエリアで範囲選択中か判断する
   */
  isSelectRange(): boolean {
    return this.caretPosStart !== this.caretPosEnd;
  }


  /**
   * 指定したpreffixをキャレット開始位置に、指定したsuffixをキャレット終了位置に挿入する
   * @param preffix
   * @param suffix
   */
  insertContentToCaretPosition(preffix: string, suffix: string) {
    // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
    const previouseCaretPosStart = this.caretPosStart;
    const previouseCaretPosEnd = this.caretPosEnd;

    this.insertPreffixAndSuffix(preffix, previouseCaretPosStart, suffix, previouseCaretPosEnd);
    this.moveCaretPosition(previouseCaretPosStart + preffix.length, previouseCaretPosEnd + preffix.length);
  }

  /**
   * 指定したtextをキャレットがある行冒頭に挿入する
   *
   * @param value
   */
  insertContentToCurrentLineStart(value: string) {
    // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
    const previouseCaretPosStart = this.caretPosStart;
    const previouseCaretPosEnd = this.caretPosEnd;

    const lineStartIndex = this.searchCurrentLineStartIndex();

    this.insertPreffixAndSuffix(value, lineStartIndex, '', lineStartIndex);
    this.moveCaretPosition(previouseCaretPosStart + value.length, previouseCaretPosEnd + value.length);
  }

  insertCodeWrapper() {
    // 挿入するとキャレット位置が変わってしまうので事前に保持しておく
    const previouseCaretPosStart = this.caretPosStart;
    const previouseCaretPosEnd = this.caretPosEnd;

    // 範囲選択時はそれを囲む
    if (this.isSelectRange()) {
      this.insertContentToCaretPosition('`', '`');
      this.moveCaretPosition(previouseCaretPosStart + 1, previouseCaretPosEnd + 1);
    } else if (this.caretPosStart === this.searchCurrentLineStartIndex()) {
      // 行冒頭の場合
      this.insertText('```\n\n```\n', this.caretPosStart);
      this.moveCaretPosition(previouseCaretPosStart + 4, previouseCaretPosEnd + 4);
    } else {
      // それ以外の場合
      this.insertContentToCaretPosition('`', '`');
      this.moveCaretPosition(previouseCaretPosStart + 1, previouseCaretPosEnd + 1);
    }
  }
}
