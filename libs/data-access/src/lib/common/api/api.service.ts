import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from '@tt/shared';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  config = inject(AppConfigService);

  private buildUrl(url: string): string {
    return `${this.config.apiUrl}${url}`;
  }

  get<T>(
    url: string,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams | Record<string, string | number | boolean>;
    },
  ) {
    return this.http.get<T>(this.buildUrl(url), options);
  }

  post<T>(
    url: string,
    body: unknown,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams | Record<string, string | number | boolean>;
    },
  ) {
    return this.http.post<T>(this.buildUrl(url), body, options);
  }

  put<T>(url: string, body: unknown) {
    return this.http.put<T>(this.buildUrl(url), body);
  }

  patch<T>(
    url: string,
    body: unknown,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams | Record<string, string | number | boolean>;
    },
  ) {
    return this.http.patch<T>(this.buildUrl(url), body, options);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(this.buildUrl(url));
  }
}
