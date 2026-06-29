import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from '../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private config: AppConfigService) {
  }

  private buildUrl(url: string): string {
    return `${this.config.apiUrl}${url}`;
  }

  get<T>(url: string) {
    return this.http.get<T>(
      this.buildUrl(url)
    );
  }

  post<T>(
    url: string,
    body: unknown,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams | Record<string, string | number | boolean>;
    }
  ) {
    return this.http.post<T>(
      this.buildUrl(url),
      body,
      options
    );
  }

  put<T>(url: string, body: unknown) {
    return this.http.put<T>(
      this.buildUrl(url),
      body
    );
  }

  delete<T>(url: string) {
    return this.http.delete<T>(
      this.buildUrl(url)
    );
  }
}
