import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class LearnerService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${ localStorage.getItem('jwt') }`
  });
  private apiUrl = 'https://api-dev.mygo1.com/v3';
  constructor(private http: Http) { }

  getLearnerAwards(): Observable<any> {
    const url = `${ this.apiUrl }/award-service/instance/${ localStorage.getItem('activeInstance') }?status[]=in-progress&status[]=completed&enrolment=true`;

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json());
  }

  recordLearning(award, options): Observable<any> {
    const url = `${ this.apiUrl }/award-service/${ award.id }/item/manual`;
    options.completion_date = new Date().toISOString();

    return this.http.post(url, options, { headers: this.headers });
  }
}
