import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { ResponseSW } from '../response-sw.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient) { }

  getPeople(url: string): Observable<ResponseSW> {
    return this.http.get<ResponseSW>(url)
      .pipe(
        map(responseData => {
          return responseData;
        }));
  }
}
