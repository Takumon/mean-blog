import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SearchConditionModel } from './search-condition.model';
import { JwtService } from '../../shared/services/jwt.service';


@Injectable()
export class SearchConditionService {
  baseUrl = '/api/searchconditions';

  constructor(
    private http: Http,
    private jwtService: JwtService,
  ) { }

  getAll(condition, withUser: Boolean = false): Observable<Array<SearchConditionModel>> {
    let con = {};
    if (condition && condition.userId) {
      con = {
        userId: condition.userId
      };
    }
    const URL = this.baseUrl;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    search.set('condition', JSON.stringify(con));
    if (withUser) {
      search.set('withUser', 'true');
    }

    return this.http
      .get(URL, { headers, search })
      .map((response: Response) => response.json() as Array<SearchConditionModel>);
  }

  getById(_id: string): Observable<SearchConditionModel> {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .get(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json() as SearchConditionModel);
  }

  create(user: SearchConditionModel): Observable<any> {
    const URL = this.baseUrl;

    return this.http
      .post(URL, user, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  update(searchCondition: SearchConditionModel) {
    const URL = `${this.baseUrl}/${searchCondition._id}`;

    return this.http
      .put(URL, searchCondition, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }

  delete(_id: string) {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http
      .delete(URL, this.jwtService.getRequestOptions())
      .map((response: Response) => response.json());
  }
}
