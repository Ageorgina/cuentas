import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DescargasService {

  constructor( private http: HttpClient) { }
  descargar(url) {

    return this.http.get(url, { responseType: 'blob' });
  }
  excel(url) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/xlsx' || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.get(url, { headers, responseType: 'blob' });
  }
}
