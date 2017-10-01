import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { MdSnackBar, MdDialog } from '@angular/material';

import { ArticleService } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';
import { SearchConditionService } from '../shared/search-condition.service';
import { ArticleWithUserModel } from '../shared/article-with-user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserModel } from '../../users/shared/user.model';
import { CommentModel } from '../shared/comment.model';
import { VoterListComponent } from './voter-list.component';
import { SearchConditionDialogComponent } from './search-condition.dialog';
import { SearchConditionModel } from '../shared/search-condition.model';
import { LocalStrageService, KEY } from '../../shared/services/local-strage.service';


enum Mode {
  ALL,
  FAVORIT,
  USER,
}

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  providers: [ ArticleService ],
})
export class ArticleListComponent implements OnInit {
  static Mode = Mode;
  articles: Array<ArticleWithUserModel>;
  seaerchConditions: Array<SearchConditionModel>;

  constructor(
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private localStrageService: LocalStrageService,
    private commentService: CommentService,
    private articleService: ArticleService,
    private searchConditionService: SearchConditionService,
    public auth: AuthenticationService,
    public dialog: MdDialog,
  ) {
  }

  ngOnInit() {
    this.getSearchCondition(this.getArticles);
  }

  refreshComments(item: ArticleWithUserModel, event: any) {
    item.comments = event.comments;
  }

  toggleCommentDetail(item: ArticleWithUserModel) {
    item.showCommentDetail = !item.showCommentDetail;
  }

  getSearchCondition(cb: Function) {
    this.searchConditionService.getAll({
      userId: this.auth.loginUser._id.toString()
    }, true).subscribe(con => {
      this.seaerchConditions = con as Array<SearchConditionModel>;

      if (this.seaerchConditions && this.seaerchConditions.length > 0) {

        let selectedId;
        // 選択している検索条件がない場合は一番先頭の検索条件を選択する
        if (!this.localStrageService.has(KEY.SELECTED_CONDITION_ID)) {
          selectedId = this.seaerchConditions[0]._id.toString();
          this.localStrageService.set(KEY.SELECTED_CONDITION_ID, selectedId);
        } else {
          selectedId = this.localStrageService.get(KEY.SELECTED_CONDITION_ID);

          // 選択している場合でも検索条件に一致するものがない場合は一番先頭の検索条件を選択する
          let foundSelected = false;
          for (const condition of this.seaerchConditions) {
            if (selectedId === condition._id.toString()) {
              foundSelected = true;
              break;
            }
          }

          if (!foundSelected) {
            selectedId = this.seaerchConditions[0]._id.toString();
            this.localStrageService.set(KEY.SELECTED_CONDITION_ID, selectedId);
          }
        }


        // 検索条件にcheckedをセットする
        for (const condition of this.seaerchConditions) {
          condition.checked = selectedId === condition._id.toString();
        }
      } else {
        // 選択した検索条件を初期化する
        this.localStrageService.remove(KEY.SELECTED_CONDITION_ID);
      }

      if (cb) {
        cb.apply(this);
      }
    });
  }

  selectCondition(selectedId: string) {
    this.localStrageService.set(KEY.SELECTED_CONDITION_ID, selectedId);
    for (const condition of this.seaerchConditions) {
      condition.checked  = selectedId === condition._id.toString();
    }
    this.getArticles();
  }

  getArticles(): void {
    this.route.data.subscribe((data: any) => {
      let condition;
      const withUser = true;
      const mode = data['mode'];
      switch (mode) {
        case Mode.ALL:
          this.articleService.get({}, withUser)
          .subscribe(articles => {
            this.articles = articles as Array<ArticleWithUserModel>;
          });
          break;
        case Mode.FAVORIT:
          const hoge = this.createCondition();
          this.articleService.get(
            hoge,
            withUser)
          .subscribe(articles => {
            this.articles = articles as Array<ArticleWithUserModel>;
          });
          break;
        case Mode.USER:
          this.route.parent.params.subscribe( params => {
            const userId = params['_userId'];
            this.articleService.get(condition = {
              author: { userId: userId }
            }, withUser)
            .subscribe(articles => {
              this.articles = articles as Array<ArticleWithUserModel>;
            });
          });
          break;
      }
    });
  }

  // TODO 今はユーザ情報のみだが今後条件を追加する
  createCondition(): Object {
    const noCondition = {};

    if (!this.seaerchConditions
      || this.seaerchConditions.length === 0) {
      return noCondition;
    }

    let selected = this.seaerchConditions[0];

    for (const con of this.seaerchConditions) {
      if (con.checked) {
        selected = con;
        break;
      }
    }

    if (!selected.users || selected.users.length === 0) {
      return noCondition;
    }
    return {
      author: { _id: selected.users.map(u => {
        return u._id.toString();
      }) }
    };

  }

  // TODO コメントはプレーンテキスト固定で良いか検討
  createNewComment(item: ArticleWithUserModel) {
    const newComment = new CommentModel();
    newComment.user = this.auth.loginUser._id;
    newComment.articleId = item._id;

    item.newComment = newComment;
  }

  cancelNewComment(item: ArticleWithUserModel) {
    item.newComment = null;
  }

  registerComment(item: ArticleWithUserModel, newComment: CommentModel) {
    this.commentService
      .register(newComment)
      .subscribe(res => {
        this.commentService
          .getOfArticle(newComment.articleId, true)
          .subscribe(comments => {
            this.snackBar.open('コメントしました。', null, {duration: 3000});
            item.newComment = null;
            item.comments = comments;
          });
      });
  }

  registerVote(item: ArticleWithUserModel) {
    this.articleService
      .registerVote(item._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねしました。', null, {duration: 3000});
        this.articleService.getVoteOne(item._id)
          .subscribe(vote => {
            item.vote = vote;
          });
      });
  }

  deleteVote(item: ArticleWithUserModel) {
    this.articleService
      .deleteVote(item._id, this.auth.loginUser._id)
      .subscribe(article => {
        this.snackBar.open('いいねを取り消しました。', null, {duration: 3000});
        this.articleService.getVoteOne(item._id)
          .subscribe(vote => {
            item.vote = vote;
          });
      });
  }

  containMineVote(votes: Array<UserModel>): boolean {
    if (!votes) {
      return false;
    }

    const _idOfMine = this.auth.loginUser._id;
    return votes.some(v => _idOfMine === v._id);
  }

  openVotersList(voters: Array<UserModel>) {
    const dialogRef = this.dialog.open(VoterListComponent, {
      width: '360px',
      data: { voters: voters }
    });
  }

  openSerchCondition() {
    const dialogRef = this.dialog.open(SearchConditionDialogComponent, {
      width: '600px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.name && (!result.users || result.users.length < 1)) {
        // do nothing
        return;
      }

      this.searchConditionService
        .create(result as SearchConditionModel)
        .subscribe(res => {
          this.snackBar.open('お気に入り検索条件を登録しました。', null, {duration: 3000});
          // TODO 初期化処理が冗長
          this.getSearchCondition(this.getArticles);
        });
    });
  }

  deleteCondition(id: string) {
    this.searchConditionService
      .delete(id)
      .subscribe(res => {
        this.snackBar.open('お気に入り検索条件を削除しました。', null, {duration: 3000});
        // TODO 初期化処理が冗長
        this.getSearchCondition(this.getArticles);
      });
  }
}
