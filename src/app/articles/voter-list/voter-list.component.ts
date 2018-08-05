import { Component, Input} from '@angular/core';

import { Constant } from '../../shared/constant';
import { UserModel } from '../../shared/models';

@Component({
  selector: 'app-voter-list',
  templateUrl: './voter-list.component.html',
  styleUrls: ['./voter-list.component.scss'],
})
export class VoterListComponent {
  /** 定数クラス、HTMLで使用するのでコンポーネントのメンバとしている */
  public Constant = Constant;

  @Input() voters: UserModel[];

  constructor() { }
}
