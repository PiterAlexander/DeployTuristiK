import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {
  private apiKey: string = 'AIzaSyBqec4BbHwZT5HmJ-hJVcTsHJ_l-n3fmsE';

  constructor(private http: HttpClient) { }

  getAutocompleteSuggestions(input: string): Observable<any> {
    const apiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const params = new HttpParams()
      .set('input', input)
      .set('key', this.apiKey);

    return this.http.get(apiUrl, { params });
  }
}