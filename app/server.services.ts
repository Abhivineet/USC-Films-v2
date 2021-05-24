import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {SearchCard} from './shared/models/search-card.model';
// import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ServerServices{
  serverAddress = 'https://vmdb-310106.wl.r.appspot.com';
  constructor(private http: HttpClient) {}

  search(term: string): Observable<[any, SearchCard[]]> | Observable<any[]> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<[any, SearchCard[]]>(`${this.serverAddress}/api/search/${term}`);
  }

  getCpmcCarousel(): Observable<any>{
    return this.http.get(`${this.serverAddress}/api/cpmc`);
  }

  getHome(): Observable<any>{
    return this.http.get(`${this.serverAddress}/api/home_data`);
  }

  getResults(media: string, id: string): Observable<any>{
    return this.http.get(`${this.serverAddress}/api/details/${media}/${id}`);
  }

  getCastDetails(id: string): Observable<any>{
    return this.http.get(`${this.serverAddress}/api/details/person/${id}`);
  }
}
