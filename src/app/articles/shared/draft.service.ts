import { Injectable } from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions,
  Response,
  URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { JwtService } from '../../shared/services/jwt.service';

import { DraftModel } from './draft.model';

@Injectable()
export class DraftService {
  public MAX_DRAFT_COUNT: Number = 10;

  private baseUrl = '/api/drafts';

  constructor(
    private http: Http,
    private jwtService: JwtService,
    private auth: AuthenticationService,
  ) { }

  get(condition = {}): Observable<Array<DraftModel>> {

    const URL = this.baseUrl;
    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(condition));

    return this.http
      .get(URL, { headers, search })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getById(_id: string): Observable<DraftModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  create(model: DraftModel): Observable<DraftModel> {
    const URL = this.baseUrl;

    return this.http
      .post(URL, model, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  update(model: DraftModel): Observable<DraftModel> {
    const URL = `${this.baseUrl}/${model._id}`;

    return this.http
      .put(URL, model, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  delete(_id: string): Observable<DraftModel>  {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getMineCount(): Observable<Number> {
    const condition = { userId: this.auth.loginUser._id };
    return this.get(condition)
    .map(drafts => drafts ? drafts.length : 0);
  }

  canRegisterDraft(): Observable<Boolean> {
    return this.getMineCount().map(count => count < this.MAX_DRAFT_COUNT);
  }
}
