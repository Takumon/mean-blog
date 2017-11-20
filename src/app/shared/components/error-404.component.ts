import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-error-404',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class Error404Component implements OnInit {
  public errorCode: string;
  public errorMessage: string;

  constructor() {

  }

  ngOnInit(): void {
    this.errorCode = '404';
    this.errorMessage = 'ページがつかりません';
  }
}
