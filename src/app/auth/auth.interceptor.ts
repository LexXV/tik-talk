import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from 'rxjs';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (!token) return next(req);

  if (isRefreshing$.value) {
    return refreshAndProceed(authService, req, next);
  }

  return next(addToken(req, token))
    .pipe(
      catchError(error => {
        if (error.status === 403) {
          return refreshAndProceed(authService, req, next);
        }

        return throwError(() => error); //return throwError(error); - is deprecated in RxJS 7. RxJS 8 recommended approach is used instead.
      })
    );
};

const refreshAndProceed
  = (authService: AuthService,
     req: HttpRequest<any>, // with "any" TypeScript is actually disabled. And it's highly recommended to use "unknown"
     next: HttpHandlerFn
) => {
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);
    return authService.refreshAuthToken()
      .pipe(
        switchMap(res => {

          return next(addToken(req, res.access_token))
            .pipe(
              tap(() => isRefreshing$.next(false))
            );
        })
      );
  }

  if (req.url.includes('refresh')) return next(addToken(req, authService.token!));

  return isRefreshing$.pipe(
    filter(isRefreshing => !isRefreshing),
    switchMap(res => {
      return next(addToken(req, authService.token!)); // Do not do this often in production - 'token!' even though it is checked before
    })
  );
};

const addToken = (req: HttpRequest<any>, token: string) => {
  // with "any" TypeScript is actually disabled. And it's highly recommended to use "unknown"
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};
