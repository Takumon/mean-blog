import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MessageService } from '../../shared/services/message.service';
import { CommentModel } from '../shared/comment.model';
import { ArticleService } from '../shared/article.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {
  @Input() isAuthfocuse: boolean;
  @Input() commentModel: CommentModel;
  @Input() hasCancelBtn: boolean;
  @Output() complete = new EventEmitter();
  @Output() cancel = new EventEmitter();
  message: String;
  form: FormGroup;
  action: string;
  isRegister: boolean;

  constructor(
    private articleService: ArticleService,
    private auth: AuthenticationService,
    public messageService: MessageService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.isRegister = !!this.commentModel.created;
    this.action = this.commentModel.created ? '更新' : '追加';
  }


  createForm() {
    this.form = this.fb.group({
      commentText: ['', [
        Validators.required,
      ]],
    });

    this.form.patchValue({
      commentText: this.commentModel.text
    });
  }

  get commentText() { return this.form.get('commentText'); }

  hasError(validationName: string, control: FormControl): Boolean {
    return control.hasError(validationName) && control.dirty;
  }

  errorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    return !!(control.invalid && (control.dirty));
  }

  onSubmit(form: FormGroup, parentId: string = null) {
    if (!form.valid ) {
      return false;
    }

    this.commentModel.text = form.value['commentText'];

    if (this.isRegister) {
      this.articleService
        .registerComment(this.commentModel)
        .subscribe(res => {
          // TODO エラー処理

          this.form.reset();
          this.complete.emit();
        });
    } else {
      this.articleService
        .updateComment(this.commentModel)
        .subscribe(res => {
          // TODO エラー処理

          this.form.reset();
          this.complete.emit();
        });
    }

  }

  onCancel(): void {
    this.cancel.emit();
  }
}
