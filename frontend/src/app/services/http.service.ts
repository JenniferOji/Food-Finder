import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  public get(url: string){
    return this.http.get(url);
  }
}
