import { Component, OnInit } from '@angular/core';

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
