import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { JwtService } from '../../shared/services/jwt.service';

import { DraftModel } from './draft.model';

@Injectable()
export class DraftService {
  public MAX_DRAFT_COUNT: Number = 10;

  private baseUrl = '/api/drafts';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private auth: AuthenticationService,
  ) { }

  get(condition = {}): Observable<Array<DraftModel>> {
    const URL = this.baseUrl;
    const headers = this.jwtService.getHeaders();
    const params = new HttpParams()
    .set('condition', JSON.stringify(condition));

    return this.http.get<Array<DraftModel>>(URL, { headers, params });
  }

  getById(_id: string): Observable<DraftModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.get<DraftModel>(URL, this.jwtService.getRequestOptions());
  }

  create(model: DraftModel): Observable<DraftModel> {
    const URL = this.baseUrl;

    return this.http.post<DraftModel>(URL, model, this.jwtService.getRequestOptions());
  }

  update(model: DraftModel): Observable<DraftModel> {
    const URL = `${this.baseUrl}/${model._id}`;

    return this.http.put<DraftModel>(URL, model, this.jwtService.getRequestOptions());
  }

  delete(_id: string): Observable<DraftModel>  {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete<DraftModel>(URL, this.jwtService.getRequestOptions());
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
