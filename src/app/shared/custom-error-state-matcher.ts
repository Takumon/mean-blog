import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import {
  ErrorStateMatcher
} from '@angular/material';


@Injectable()
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl| FormGroup, form: NgForm | FormGroupDirective): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || isSubmitted));
  }
}
