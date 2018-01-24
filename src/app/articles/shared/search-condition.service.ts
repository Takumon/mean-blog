import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DATE_RANGE_PATTERN } from '../../shared/enum/date-range-pattern.enum';
import { JwtService } from '../../shared/services/jwt.service';

import { SearchConditionModel } from './search-condition.model';

@Injectable()
export class SearchConditionService {
  private baseUrl = '/api/searchconditions';
  private dateRangePatterns: typeof DATE_RANGE_PATTERN = DATE_RANGE_PATTERN;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
  ) { }

  get(condition, withUser: boolean = false): Observable<Array<SearchConditionModel>> {
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
    let params = new HttpParams()
      .set('condition', JSON.stringify(modifiedCondition));
    if (withUser) {
      params = params.set('withUser', 'true');
    }

    return this.http.get<Array<SearchConditionModel>>(URL, { headers, params });
  }

  getById(_id: string, withUser: boolean = false): Observable<SearchConditionModel> {
    const URL = `${this.baseUrl}/${_id}`;

    const headers = this.jwtService.getHeaders();
    let params = new HttpParams();
    if (withUser) {
      params = params.set('withUser', 'true');
    }

    return this.http.get<SearchConditionModel>(URL, { headers, params });
  }

  create(user: SearchConditionModel): Observable<any> {
    const URL = this.baseUrl;

    return this.http.post(URL, user, this.jwtService.getRequestOptions());
  }

  update(searchCondition: SearchConditionModel) {
    const URL = `${this.baseUrl}/${searchCondition._id}`;

    return this.http.put(URL, searchCondition, this.jwtService.getRequestOptions());
  }

  delete(_id: string) {
    const URL = `${this.baseUrl}/${_id}`;

    return this.http.delete(URL, this.jwtService.getRequestOptions());
  }
}
