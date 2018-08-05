import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Constant } from '../../shared/constant';
import {
  AuthenticationService,
  MessageService,
  MessageBarService,
} from '../../shared/services';
import { CommentModel } from '../../shared/models';

import { CommentService } from '../shared/comment.service';

/**
 * コメント入力フォーム
 */
@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit, AfterViewChecked {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  /** コンポーネント初期表示時にリプライ入力エリアにフォーカスを当てるか */
  @Input() isAuthfocuse: boolean;

  /**
   * 処理対象のコメントモデル<br>
   * 更新時は既存のモデルを指定する<br>
   * 登録時は新規作成したモデルにarticleIdとuserを設定したものを指定する
   */
  @Input() model: CommentModel;

  /** キャンセルボタンを表示するか */
  @Input() hasCancelBtn: boolean;

  /** 登録または更新完了時に発行するイベント */
  @Output() complete = new EventEmitter();

  /** キャンセル時に発行するイベント */
  @Output() cancel = new EventEmitter();

  /** フォーム */
  public form: FormGroup;

  /** 処理名(登録または更新) */
  public action: '登録' | '更新';

  /** コンストラクタ */
  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,

    public messageService: MessageService,
    private messageBarService: MessageBarService,
    private commentService: CommentService,
    public auth: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.action = this.model.created ?  '更新' : '登録';
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }


  /**
   * Formを作成し、値を初期化する
   */
  createForm() {
    this.form = this.fb.group({
      text: ['', [
        Validators.required,
        Validators.maxLength(400),
      ]],
    });

    this.form.patchValue({
      text: this.model.text
    });
  }

  /**
   * FromのtextのFromControlオブジェクトを取得する
   */
  get text(): FormControl { return this.form.get('text') as FormControl; }

  /**
   * 更新または登録処理をする<br>
   * <p>
   * 更新または登録後にフォームをクリアするが
   * FormGroupのresetではNgFormのsubmittedがクリアされないので
   * NgForm#resetFormを呼ぶ
   * </p>
   *
   * @param ngForm 更新または登録後にフォームを初期化するために引数にとる
   */
  upsert(ngForm: NgForm) {
    const form = this.form;
    if (!form.valid ) {
      return false;
    }

    this.model.text = form.value['text'];

    const action = this.isRegister()
      ? this.commentService.register(this.model)
      : this.commentService.update(this.model);

    action.subscribe(
      this.onSuccess.bind(this, ngForm),
      this.onValidationError.bind(this)
    );
  }

  /**
   * キャンセル時の処理
   */
  onCancel(): void {
    this.cancel.emit();
  }


  /**
   * actionが登録か
   *
   * @return 登録の場合true.更新の場合false
   */
  private isRegister(): boolean {
    return this.action === '登録';
  }

  /**
   * 登録または更新成功時の処理
   *
   * @param ngForm NgFormオブジェクト
   * @param res 登録または更新時のレスポンス
   */
  private onSuccess(ngForm: NgForm, res: any): void {
    this.snackBar.open(`コメントを${this.action}しました。`, null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
    this.complete.emit();
    this.form.reset();
    ngForm.resetForm();
  }

  /**
   * 登録または更新失敗時の処理
   *
   * @param error エラー情報
   */
  private onValidationError(error: any): void {
    const noControlErrors = [];

    for (const e of error['errors']) {
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
}
