import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

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
