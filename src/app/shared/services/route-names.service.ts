import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class RouteNamesService {
  public name = new Subject<String>();
}
