import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  MatSnackBar,
  MatDialog,
  MatInputModule,
} from '@angular/material';
import * as moment from 'moment';

import { Constant } from '../../shared/constant';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { LocalStrageService, KEY } from '../../shared/services/local-strage.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm.dialog';
import { DATE_RANGE_PATTERN, DateRange } from '../../shared/enum/date-range-pattern.enum';

import { UserModel } from '../../users/shared/user.model';

import { SearchConditionService } from '../shared/search-condition.service';
import { SearchConditionModel } from '../shared/search-condition.model';
import { SearchConditionDialogComponent } from './search-condition.dialog';

@Component({
  selector: 'app-search-condition',
  templateUrl: './search-condition.component.html',
  styleUrls: ['./search-condition.component.scss'],
})
export class SearchConditionComponent implements OnInit {
  private Constant = Constant;
  @Output() changeSeaerchCondition = new EventEmitter();
  seaerchConditions: Array<SearchConditionModel>;
  dateRangePatterns: typeof DATE_RANGE_PATTERN = DATE_RANGE_PATTERN;
  dateRange = DateRange;

  constructor(
    public snackBar: MatSnackBar,
    private localStrageService: LocalStrageService,
    private searchConditionService: SearchConditionService,
    public auth: AuthenticationService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getSearchCondition();
  }

  getSearchCondition() {
    const withUser = true;

    this.searchConditionService.getAll({
      userId: this.auth.loginUser._id.toString()
    }, withUser).subscribe(con => {
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

      this.changeSeaerchCondition.emit();
    });
  }

  selectCondition(selectedId: string) {
    this.localStrageService.set(KEY.SELECTED_CONDITION_ID, selectedId);
    for (const condition of this.seaerchConditions) {
      condition.checked  = selectedId === condition._id.toString();
    }

    this.changeSeaerchCondition.emit();
  }


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


    const condition = {};

    if (selected.users && selected.users.length > 0) {
      condition['author'] = {
        _id: selected.users.map(u => {
          return u._id.toString();
        })
      };
    }

    if (selected.dateSearchPattern) {
      const dateRangeCondition = this.dateRange.of(
        selected.dateSearchPattern,
        selected.dateFrom && new Date(selected.dateFrom),
        selected.dateTo && new Date(selected.dateTo)
      );
      condition['dateFrom'] = dateRangeCondition.dateFrom;
      condition['dateTo'] = dateRangeCondition.dateTo;
    }

    return condition;
  }


  // 引数なしの場合は新規登録
  openSerchConditionDialog(conditionForUpdate: SearchConditionModel = null) {
    const dialogRef = this.dialog.open(SearchConditionDialogComponent, {
      width: '810px',
      data: { idForUpdate:  conditionForUpdate && conditionForUpdate._id.toString() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      if (conditionForUpdate) {
        this.snackBar.open('お気に入り検索条件を更新しました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
        // 選択中の検索条件を更新した時だけ再検索
        if (conditionForUpdate.checked) {
          this.getSearchCondition();
        } else {
          // 選択中以外の場合は検索条件リストを入れ替えるだけ
          const conditions = this.seaerchConditions;
          const len = conditions.length;
          for (let i = 0; i < len; i++ ) {
            if (conditions[i]._id === conditionForUpdate._id) {
              this.searchConditionService
              .getById( result._id.toString(), true)
              .subscribe(c => this.seaerchConditions[i] = c);
              break;
            }
          }
        }
      } else {
        this.snackBar.open('お気に入り検索条件を登録しました。', null, this.Constant.SNACK_BAR_DEFAULT_OPTION);

        // 初登録の場合は再検索
        if (this.seaerchConditions.length === 0) {
          this.getSearchCondition();
        } else {
          // すでに検索条件がある場合は検索条件リストに追加するだけ
          this.searchConditionService
          .getById( result._id.toString(), true)
          .subscribe(c => this.seaerchConditions.push(c));
        }
      }
    });
  }

  deleteCondition(conditionForDelete: SearchConditionModel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '検索条件削除',
        message: `「${conditionForDelete.name}」を削除しますか？`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.searchConditionService
      .delete(conditionForDelete._id.toString())
      .subscribe(res => {
        this.snackBar.open(`お気に入り検索条件「${conditionForDelete.name}」を削除しました。`, null, this.Constant.SNACK_BAR_DEFAULT_OPTION);
        if (conditionForDelete.checked) {
          this.getSearchCondition();
        } else {
          // 選択中以外の場合は検索条件リストから削除するだけ
          const conditions = this.seaerchConditions;
          const len = conditions.length;
          for (let i = 0; i < len; i++ ) {
            if (conditions[i]._id === conditionForDelete._id) {
              this.seaerchConditions.splice(i, 1);
            }
          }
        }
      });
    });
  }

  dateRangeDisp(condition: SearchConditionModel): string {
    const pattern = condition.dateSearchPattern;

    const patternDisp = this.dateRangePatterns[pattern];

    let from;
    let to;
    if (this.isSpecificDateRange(pattern)) {
      const range = this.dateRange.of(pattern, new Date(condition.dateFrom), new Date(condition.dateTo));
      from = condition.dateFrom ? moment(range.dateFrom).format('YYYY/MM/DD') : '指定なし';
      to = condition.dateTo ? moment(range.dateTo).format('YYYY/MM/DD') : '指定なし';
    } else {
      from = moment(this.dateRange.of(pattern).dateFrom).format('YYYY/MM/DD');
      to   = moment(this.dateRange.of(pattern).dateTo  ).format('YYYY/MM/DD');
    }

    return `${patternDisp} ( ${from} - ${to} )`;
  }

  isSpecificDateRange(pattern: string) {
    return DATE_RANGE_PATTERN.期間指定 === Number(pattern);
  }
}
