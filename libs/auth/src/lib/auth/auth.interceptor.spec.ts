import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppConfigService } from '@tt/shared';
import { AuthService } from '@tt/data-access/auth';
import { authTokenInterceptor } from './auth.interceptor';

describe('auth interceptor with real refresh HTTP', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let auth: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AppConfigService, useValue: { apiUrl: '/api' } },
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    TestBed.inject(CookieService).deleteAll('/');
    jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    auth.saveTokens({ access_token: 'synthetic-old', refresh_token: 'synthetic-refresh' });
  });
  afterEach(() => {
    http.verify();
    TestBed.inject(CookieService).deleteAll('/');
    jest.restoreAllMocks();
  });

  it('attaches bearer tokens, bypasses DaData and sends tokenless requests unchanged', () => {
    client.get('/private').subscribe();
    const secured = http.expectOne('/private');
    expect(secured.request.headers.get('Authorization')).toBe('Bearer synthetic-old');
    secured.flush({});
    client.get('https://dadata.ru/suggest').subscribe();
    const thirdParty = http.expectOne('https://dadata.ru/suggest');
    expect(thirdParty.request.headers.has('Authorization')).toBe(false);
    thirdParty.flush({});
    auth.token = null;
    client.get('/public').subscribe();
    const publicRequest = http.expectOne('/public');
    expect(publicRequest.request.headers.has('Authorization')).toBe(false);
    publicRequest.flush({});
  });

  it('propagates non-403 errors without refresh', () => {
    const error = jest.fn();
    client.get('/private').subscribe({ error });
    http.expectOne('/private').flush({}, { status: 500, statusText: 'Failure' });
    expect(error.mock.calls[0][0].status).toBe(500);
    http.expectNone('/api/auth/refresh');
  });

  it('shares a refresh across concurrent 403s and completes each retry once with the new token', () => {
    const first = jest.fn(),
      second = jest.fn(),
      complete = jest.fn();
    client.get('/first').subscribe({ next: first, complete });
    client.get('/second').subscribe({ next: second, complete });
    http.expectOne('/first').flush({}, { status: 403, statusText: 'Forbidden' });
    http.expectOne('/second').flush({}, { status: 403, statusText: 'Forbidden' });
    const refresh = http.expectOne('/api/auth/refresh');
    refresh.flush({ access_token: 'synthetic-new', refresh_token: 'synthetic-new-refresh' });
    const retry = http.expectOne('/first');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer synthetic-new');
    retry.flush({ id: 1 });
    const other = http.expectOne('/second');
    expect(other.request.headers.get('Authorization')).toBe('Bearer synthetic-new');
    other.flush({ id: 2 });
    expect(first).toHaveBeenCalledWith({ id: 1 });
    expect(second).toHaveBeenCalledWith({ id: 2 });
    expect(complete).toHaveBeenCalledTimes(2);
    // A later refresh must not reissue either already completed request.
    client.get('/later').subscribe();
    http.expectOne('/later').flush({}, { status: 403, statusText: 'Forbidden' });
    http
      .expectOne('/api/auth/refresh')
      .flush({ access_token: 'synthetic-later', refresh_token: 'synthetic-later-refresh' });
    http.expectOne('/later').flush({});
    http.expectNone('/first');
    http.expectNone('/second');
  });

  it('queues a new request during refresh and completes it once with the shared new token', () => {
    const first = jest.fn(),
      firstComplete = jest.fn();
    client.get('/starts-refresh').subscribe({ next: first, complete: firstComplete });
    http.expectOne('/starts-refresh').flush({}, { status: 403, statusText: 'Forbidden' });
    const refresh = http.expectOne('/api/auth/refresh');

    const queued = jest.fn(),
      queuedComplete = jest.fn();
    client.get('/new-during-refresh').subscribe({ next: queued, complete: queuedComplete });
    http.expectNone('/new-during-refresh');
    http.expectNone('/api/auth/refresh');
    expect(queued).not.toHaveBeenCalled();
    expect(queuedComplete).not.toHaveBeenCalled();

    refresh.flush({ access_token: 'synthetic-shared', refresh_token: 'synthetic-shared-refresh' });
    const retry = http.expectOne('/starts-refresh');
    const newRequest = http.expectOne('/new-during-refresh');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer synthetic-shared');
    expect(newRequest.request.headers.get('Authorization')).toBe('Bearer synthetic-shared');
    retry.flush({ id: 1 });
    newRequest.flush({ id: 2 });
    expect(first).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledWith({ id: 1 });
    expect(firstComplete).toHaveBeenCalledTimes(1);
    expect(queued).toHaveBeenCalledTimes(1);
    expect(queued).toHaveBeenCalledWith({ id: 2 });
    expect(queuedComplete).toHaveBeenCalledTimes(1);
    http.expectNone('/api/auth/refresh');
  });

  it.each([401, 403])(
    'errors all waiters on refresh HTTP %s and permits requests after a fresh login',
    (status) => {
      const errors = jest.fn();
      client.get('/failed').subscribe({ error: errors });
      client.get('/waiting').subscribe({ error: errors });
      http.expectOne('/failed').flush({}, { status: 403, statusText: 'Forbidden' });
      http.expectOne('/waiting').flush({}, { status: 403, statusText: 'Forbidden' });
      http.expectOne('/api/auth/refresh').flush({}, { status, statusText: 'Rejected' });
      expect(errors).toHaveBeenCalledTimes(2);
      expect(errors.mock.calls.map(([error]) => error.status)).toEqual([status, status]);
      expect(auth.token).toBeNull();
      auth.saveTokens({
        access_token: 'synthetic-relogin',
        refresh_token: 'synthetic-relogin-refresh',
      });
      const result = jest.fn();
      client.get('/after-login').subscribe(result);
      const request = http.expectOne('/after-login');
      expect(request.request.headers.get('Authorization')).toBe('Bearer synthetic-relogin');
      request.flush({ recovered: true });
      expect(result).toHaveBeenCalledWith({ recovered: true });
    },
  );

  it('propagates a failed retry and allows a later refresh cycle', () => {
    const error = jest.fn();
    client.get('/retry-fails').subscribe({ error });
    http.expectOne('/retry-fails').flush({}, { status: 403, statusText: 'Forbidden' });
    http
      .expectOne('/api/auth/refresh')
      .flush({ access_token: 'synthetic-new', refresh_token: 'synthetic-refresh-new' });
    http.expectOne('/retry-fails').flush({}, { status: 500, statusText: 'Failure' });
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0].status).toBe(500);
    const result = jest.fn();
    client.get('/next-cycle').subscribe(result);
    http.expectOne('/next-cycle').flush({}, { status: 403, statusText: 'Forbidden' });
    http
      .expectOne('/api/auth/refresh')
      .flush({ access_token: 'synthetic-next', refresh_token: 'synthetic-refresh-next' });
    const retry = http.expectOne('/next-cycle');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer synthetic-next');
    retry.flush({ recovered: true });
    expect(result).toHaveBeenCalledWith({ recovered: true });
  });
});
