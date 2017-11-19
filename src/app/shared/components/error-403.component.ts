import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-error-403',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class Error403Component implements OnInit, OnDestroy {
  public errorCode: string;
  public errorMessage: string;

  constructor() {

  }

  ngOnInit(): void {
    this.errorCode = '403';
    this.errorMessage = '権限エラーです';
    console.log('init');
  }
  ngOnDestroy(): void {
    console.log('destroy');
  }
}
