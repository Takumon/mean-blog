export class SearchConditionModel {
  _id: string;
  name: string;
  author: string;
  users: Array<any>;
  dateSearchPattern: string;
  dateFrom: string;
  dateTo: string;

  // 表示制御用
  checked: boolean;
}
