import {
  Component,
  OnInit,
  OnDestroy,
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
import { MdSnackBar } from '@angular/material';

import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { ArticleModel } from '../shared/article.model';
import { ArticleService } from '../shared/article.service';
import { EditMode } from './edit-mode.enum';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { RouteNamesService } from '../../shared/services/route-names.service';
import { MessageService } from '../../shared/services/message.service';


@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss'],
  providers: [ ArticleService ]
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  action: String;
  // 更新の場合のみ保持する
  articleId: string;
  MarkdownEditMode = EditMode;
  markdonwEditMode: String = EditMode[EditMode.harfPreviewing];
  form: FormGroup;


  @ViewChild('syncScrollTarget')
  scrollTarget: ElementRef;


  constructor(
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,

    private articleService: ArticleService,
    private auth: AuthenticationService,
    private routeNamesService: RouteNamesService,
    public messageService: MessageService,
    ) {

  }

  ngOnInit(): void {
    this.createForm();

    this.subscription = this.route.params.subscribe( params => {
      if ( params['_id']) {
        this.action = '更新';

        const withUser = true;
        this.articleService
          .getOne(params['_id'], withUser)
          .subscribe(article => {
            if (article.author._id !== this.auth.loginUser._id) {
              // TODO エラー処理か、他のユーザでも編集できる仕様にする
            }

            this.articleId = article._id;
            this.form.patchValue({
              title: article.title,
              isMarkdown: article.isMarkdown,
              body: article.body,
            });

          });
      } else {
        this.action = '投稿';
        this.form.patchValue({
          isMarkdown: true,
        });
      }

      this.routeNamesService.name.next(`記事を${this.action}する`);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.form = this.fb.group({
      title: ['', [
        Validators.required,
      ]],
      isMarkdown: ['', [
      ]],
      body: ['', [
        Validators.required,
      ]],
    });
  }

  get title() { return this.form.get('title'); }
  get body() { return this.form.get('body'); }
  get isMarkdown() { return this.form.get('isMarkdown'); }

  hasError(validationName: string, control: FormControl): Boolean {
    return control.hasError(validationName) && control.dirty;
  }

  errorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || isSubmitted));
  }


  isNew() {
    return !this.articleId;
  }


  @HostListener('scroll', ['$event'])
  private syncScroll($event: Event): void {
    const scrollAreaHight = $event.srcElement.scrollHeight - $event.srcElement.clientHeight;
    const ratio = ($event.srcElement.scrollTop / scrollAreaHight);

    const target = this.scrollTarget.nativeElement;
    target.scrollTop = (target.scrollHeight - target.clientHeight) * ratio;
  }

  onSubmit(form: FormGroup): void {
    if (!form.valid ) {
      return;
    }

    const article = new ArticleModel();
    article.title = form.value['title'];
    article.isMarkdown = form.value['isMarkdown'];
    article.body = form.value['body'];

    if (this.isNew()) {
      article.author = this.auth.loginUser._id;
      this.articleService
        .register(article)
        .subscribe((res: any) => {

          this.snackBar.open('記事を投稿しました。', null, {duration: 3000});
          this.router.navigate([`/${this.auth.loginUser.userId}`, 'articles', res.obj._id]);
        });
    } else {
      article._id = this.articleId;
      this.articleService
        .update(article)
        .subscribe((res: any) => {
          this.snackBar.open('記事を編集しました。', null, {duration: 3000});
          this.goToDetail();
        });
    }
  }

  cancel(): void {
    if (this.isNew()) {
      this.router.navigate(['/articles']);
    } else {
      this.goToDetail();
    }
  }

  goToDetail() {
    this.router.navigate([`/${this.auth.loginUser.userId}`, 'articles', this.articleId]);
  }

}
