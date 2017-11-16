import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';


/**
 * アイコン生成
 */
@Injectable()
export class IconGeneratorService {
  private baseUrl = '/api/authenticate';

  constructor(
    public http: HttpClient,
  ) { }


  getGravatarImage(userId): Observable<any> {
    const URL = `${this.baseUrl}/generate-icon`;

    const params = new HttpParams()
      .set('userId', userId);

    return this.http.get<any>(URL, { params });
  }
}
