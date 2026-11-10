import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@tt/data-access/auth/api/auth.service';
import { catchError, finalize, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { TokenResponse } from '@tt/data-access/auth/interfaces/auth.interface';

let refresh$: Observable<TokenResponse> | null = null;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('dadata.ru')) return next(req);

  const authService = inject(AuthService);
  const token = authService.token;

  if (!token) return next(req);

  // Refresh must reach the backend without waiting on itself or recursively retrying.
  if (req.url.includes('/auth/refresh')) return next(addToken(req, token));

  if (refresh$) {
    return refreshAndProceed(authService, req, next);
  }

  return next(addToken(req, token)).pipe(
    catchError((error) => {
      if (error.status === 403) {
        return refreshAndProceed(authService, req, next);
      }

      return throwError(() => error);
    }),
  );
};

const refreshAndProceed = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  if (!refresh$) {
    refresh$ = authService.refreshAuthToken().pipe(
      finalize(() => {
        refresh$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
  return refresh$.pipe(switchMap((res) => next(addToken(req, res.access_token))));
};

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
