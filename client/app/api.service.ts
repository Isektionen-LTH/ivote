import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Vote, Option } from './model';

@Injectable()
export class Api {
  constructor(private http: Http) {}

  currentVote(code: string): Observable<Vote> {
    return this.http
               .get(`http://10.3.5.240:8080/client/currentvote?id=${code}`)
               .map((r: Response) => r.json().data as Vote)
               .catch(function(error: any): Observable<Vote> {
                 var vote: Vote = {
                   title: 'Överphös',
                   options: ['Adhara', 'Bracco'].map((name) => new Option(name)),
                   selected: null
                 };
                 return Observable.create(vote);
               });
  }
}
