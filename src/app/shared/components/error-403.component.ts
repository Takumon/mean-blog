import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-error-403',
  templateUrl: './error-403.component.html',
  styleUrls: ['./error-403.component.scss']
})
export class Error403Component implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('init');
  }
  ngOnDestroy(): void {
    console.log('destroy');
  }
}
