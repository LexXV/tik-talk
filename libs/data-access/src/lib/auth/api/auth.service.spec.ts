import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppConfigService } from '@tt/shared';
import { AuthService } from './auth.service';

describe('AuthService HTTP/session contract', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  let cookies: CookieService;
  const tokens = { access_token: 'synthetic-access', refresh_token: 'synthetic-refresh' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AppConfigService, useValue: { apiUrl: '/api' } },
      ],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    cookies = TestBed.inject(CookieService);
    cookies.deleteAll('/');
    jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });
  afterEach(() => {
    http.verify();
    cookies.deleteAll('/');
    jest.restoreAllMocks();
  });

  it('posts credentials as FormData and persists/restores both session tokens', () => {
    let result: unknown;
    auth
      .login({ username: 'portfolio-user', password: 'synthetic-password' })
      .subscribe((value) => (result = value));
    const request = http.expectOne('/api/auth/token');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeInstanceOf(FormData);
    expect(request.request.body.get('username')).toBe('portfolio-user');
    expect(request.request.body.get('password')).toBe('synthetic-password');
    request.flush(tokens);
    expect(result).toEqual(tokens);
    expect(cookies.get('token')).toBe(tokens.access_token);
    expect(cookies.get('refreshToken')).toBe(tokens.refresh_token);
    auth.token = null;
    auth.refreshToken = null;
    expect(auth.isAuth).toBe(true);
    expect(auth.token).toBe(tokens.access_token);
    expect(auth.refreshToken).toBe(tokens.refresh_token);
  });

  it.each([401, 500])('propagates login HTTP %s without creating a session', (status) => {
    const error = jest.fn();
    auth.login({ username: 'invalid', password: 'invalid' }).subscribe({
      next: () => {
        throw new Error('unexpected success');
      },
      error,
    });
    http
      .expectOne('/api/auth/token')
      .flush({ detail: 'rejected' }, { status, statusText: 'Rejected' });
    expect(error.mock.calls[0][0].status).toBe(status);
    expect(auth.isAuth).toBe(false);
    expect(cookies.get('token')).toBe('');
    expect(cookies.get('refreshToken')).toBe('');
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  });

  it('refreshes using the refresh token and replaces persisted tokens', () => {
    auth.saveTokens(tokens);
    auth.refreshAuthToken().subscribe();
    const request = http.expectOne('/api/auth/refresh');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ refresh_token: tokens.refresh_token });
    request.flush({ access_token: 'synthetic-new', refresh_token: 'synthetic-new-refresh' });
    expect(auth.token).toBe('synthetic-new');
    expect(cookies.get('refreshToken')).toBe('synthetic-new-refresh');
  });

  it('clears memory/cookies and redirects when refresh fails', () => {
    auth.saveTokens(tokens);
    const error = jest.fn();
    auth.refreshAuthToken().subscribe({ error });
    http.expectOne('/api/auth/refresh').flush({}, { status: 403, statusText: 'Forbidden' });
    expect(error.mock.calls[0][0].status).toBe(403);
    expect(auth.token).toBeNull();
    expect(auth.refreshToken).toBeNull();
    expect(cookies.get('token')).toBe('');
    expect(cookies.get('refreshToken')).toBe('');
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/login']);
  });

  it('logs out an established session', () => {
    auth.saveTokens(tokens);
    auth.logout();
    expect(auth.isAuth).toBe(false);
    expect(auth.refreshToken).toBe('');
    expect(cookies.get('token')).toBe('');
    expect(cookies.get('refreshToken')).toBe('');
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/login']);
  });
});
