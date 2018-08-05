import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-500',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class Error500Component implements OnInit {
  public errorCode: string;
  public errorMessage: string;

  constructor() {

  }

  ngOnInit(): void {
    this.errorCode = '500';
    this.errorMessage = 'エラーが発生しました';
  }
}
