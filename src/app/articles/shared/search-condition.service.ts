import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { DATE_RANGE_PATTERN } from '../../shared/enum/date-range-pattern.enum';
import { JwtService } from '../../shared/services/jwt.service';

import { SearchConditionModel } from './search-condition.model';

@Injectable()
export class SearchConditionService {
  private baseUrl = '/api/searchconditions';
  private dateRangePatterns: typeof DATE_RANGE_PATTERN = DATE_RANGE_PATTERN;

  constructor(
    private http: Http,
    private jwtService: JwtService,
  ) { }

  getAll(condition, withUser: Boolean = false): Observable<Array<SearchConditionModel>> {
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
    if (withUser) {
      search.set('withUser', 'true');
    }

    return this.http
      .get(URL, { headers, search })
      .map((response: Response) => response.json() as Array<SearchConditionModel>);
  }

  getById(_id: string, withUser: Boolean = false): Observable<SearchConditionModel> {
    const URL = `${this.baseUrl}/${_id}`;

    const headers = this.jwtService.getHeaders();
    const search = new URLSearchParams();
    if (withUser) {
      search.set('withUser', 'true');
    }

    return this.http
      .get(URL, { headers, search })
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
