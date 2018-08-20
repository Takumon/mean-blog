import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constant } from '../../shared/constant';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PageEvent, MatPaginatorIntl } from '@angular/material';

import * as fromApp from '../../state';
import {
  UserService,
  PaginatorService,
} from '../../shared/services';
import { UserModel } from '../../shared/models/user.model';
import { Store } from '@ngrx/store';
import { SetTitle } from '../../state/app.actions';



enum Direction {
  ASC, DESC, NONE
}

interface SortFactor {
  label: string;
  value: string;
  sortFunc: Function;
  direction: Direction;
}

const SortFactors = {
  CREATE_DATE: {
    label: '登録日',
    value: 'created',
    sortFunc: function(isAsc: boolean): (a: UserModel, b: UserModel) => number {
      const reverse = -1;
      const nomal = 1;

      return (a, b) => {
        const a_factor = a['created'];
        const b_factor =  b['created'];

        if (a_factor > b_factor) {
          return isAsc ? nomal : reverse;
        } else if ( a_factor < b_factor) {
          return isAsc ? reverse : nomal;
        }

        return 0;
      };
    },
    direction: Direction.DESC,
  },
  UPDATE_DATE: {
    label: '更新日',
    value: 'updated',
    sortFunc: function(isAsc: boolean): (a: UserModel, b: UserModel) => number {
      const reverse = -1;
      const nomal = 1;

      return (a, b) => {
        const a_factor = a['updated'];
        const b_factor =  b['updated'];

        if (a_factor > b_factor) {
          return isAsc ? nomal : reverse;
        } else if ( a_factor < b_factor) {
          return isAsc ? reverse : nomal;
        }

        return 0;
      };
    },
    direction: Direction.NONE
  },
  USER_ID: {
    label: 'ユーザID',
    value: 'author',
    sortFunc: function(isAsc: boolean): (a: UserModel, b: UserModel) => number {
      const reverse = -1;
      const nomal = 1;

      return (a, b) => {
        const a_factor = a['userId'];
        const b_factor =  b['userId'];

        if (a_factor > b_factor) {
          return isAsc ? nomal : reverse;
        } else if ( a_factor < b_factor) {
          return isAsc ? reverse : nomal;
        }

        return 0;
      };
    },
    direction: Direction.NONE
  },
  USER_NAME: {
    label: 'ユーザ名',
    value: 'userName',
    sortFunc: function(isAsc: boolean): (a: UserModel, b: UserModel) => number {
      const reverse = -1;
      const nomal = 1;

      return (a, b) => {
        const a_factor = a['userName'];
        const b_factor =  b['userName'];

        if (a_factor > b_factor) {
          return isAsc ? nomal : reverse;
        } else if ( a_factor < b_factor) {
          return isAsc ? reverse : nomal;
        }

        return 0;
      };
    },
    direction: Direction.NONE
  },
};



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {

  public Constant = Constant;
  public users: Array<UserModel>;
  public showPrograssBar: Boolean = false;


  // ページング用プロパティ
  public $usersPerPage: Subject<Array<UserModel>> = new Subject<Array<UserModel>>();
  public DEFAULT_PER_PAGE = 20;
  public DEFAILT_PER_PAGES = [20, 50, 100];
  public direction = Direction;
  public sortFactors = SortFactors;
  public sortFactorKeys = Object.keys(SortFactors);
  public pageSize = this.DEFAULT_PER_PAGE;
  public pageIndex = 0;

  private onDestroy = new Subject();


  constructor(
    private store: Store<fromApp.State>,
    private userService: UserService,
    public paginatorService: MatPaginatorIntl,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new SetTitle({title: 'ユーザ一覧'}));
    this.getUser();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }


  private getUser(): void {
    this.userService.get()
    .pipe(takeUntil(this.onDestroy))
    .subscribe(users => {
      this.users = users;
      this.showPrograssBar = false;
      setTimeout(function() {
        this.refreshUsersPerPage(0, this.DEFAULT_PER_PAGE, users.length);
      }.bind(this), 0);
    });
  }


  refreshPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refreshUsersPerPage();
  }

  sortAndRefresh(selectedKey): void {
    for (const key of this.sortFactorKeys) {
      const factor = this.sortFactors[key];

      if (selectedKey === key) {
        switch (factor.direction) {
          case Direction.NONE:
          case Direction.ASC:
            factor.direction = Direction.DESC;
            break;
          case Direction.DESC:
            factor.direction = Direction.ASC;
        }
      } else {
        if (factor.direction !== Direction.NONE) {
          factor.direction = Direction.NONE;
        }
      }
    }

    this.refreshUsersPerPage();
  }

  // ページングとソートの設定に従って表示する記事をセットする
  refreshUsersPerPage() {
    let selectedSortFactor: SortFactor;
    for (const key of this.sortFactorKeys) {
      const factor = this.sortFactors[key];
      if (factor.direction !== Direction.NONE) {
        selectedSortFactor = factor;
        break;
      }
    }

    const asc: boolean = selectedSortFactor.direction === Direction.ASC;
    const sortSetting = selectedSortFactor.sortFunc(asc);
    const sroted = this.users.sort(sortSetting);


    const range = (this.paginatorService as PaginatorService).calcRange(this.pageIndex, this.pageSize, this.users.length);
    const paged = sroted.slice(range.startIndex, range.endIndex);

    this.$usersPerPage.next(paged);
    setTimeout(function() {
      this.scrollService.scrollToTop();
    }.bind(this), 0);
  }
}
