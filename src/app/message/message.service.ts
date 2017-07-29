import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class MessageService {

  constructor(private http: Http) {}

  getAll(): Observable<any> {
    return this.http
        .get('/api/messages')
        .map((response: Response) => {
            const result = response.json();
            return result;
        })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  register(message: string): Observable<any> {
    return this.http
      .post('/api/messages', {message: message})
      .map((response: Response) => {
            const result = response.json();
            return result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
