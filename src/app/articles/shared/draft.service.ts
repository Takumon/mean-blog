import { Injectable } from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { DraftModel } from './draft.model';
import { JwtService } from '../../shared/services/jwt.service';


@Injectable()
export class DraftService {
  baseUrl = '/api/drafts';

  constructor(
    private http: Http,
    private jwtService: JwtService,
  ) { }

  get(condition): Observable<Array<DraftModel>> {
    const modifiedCondition = {};
    if (condition) {
      if (condition.userId) {
        modifiedCondition['userId'] = condition.userId;
      }
      if (condition.dateRangePatterns) {
        modifiedCondition['userId'] = condition.userId;
      }
    }
    const URL = this.baseUrl;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(modifiedCondition));

    return this.http
      .get(URL, { headers, search })
      .map((response: Response) => response.json() as Array<DraftModel>);
  }

  getById(_id: string): Observable<DraftModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json() as DraftModel);
  }

  create(model: DraftModel): Observable<any> {
    const URL = this.baseUrl;

    return this.http
      .post(URL, model, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  update(model: DraftModel) {
    const URL = `${this.baseUrl}/${model._id}`;

    return this.http
      .put(URL, model, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  delete(_id: string) {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }
}
