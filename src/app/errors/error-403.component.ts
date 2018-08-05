import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-403',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class Error403Component implements OnInit {
  public errorCode: string;
  public errorMessage: string;

  constructor() {

  }

  ngOnInit(): void {
    this.errorCode = '403';
    this.errorMessage = '権限エラーです';
  }
}
