import {
  ApplicationConfig,
  Injectable,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  PreloadingStrategy,
  provideRouter,
  Route,
  withComponentInputBinding,
  withDebugTracing,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from '@tt/auth';
import { appConfigInitializer } from '@tt/shared';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { mergeMap, Observable, of, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DelayedPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, loadFn: () => Observable<any>): Observable<any> {
    if (route.data && !route.data['preload']) {
      return of(null);
    }

    return timer(3000).pipe(mergeMap(() => loadFn()));
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // withPreloading(DelayedPreloadingStrategy),
      // withDebugTracing(),
      // withEnabledBlockingInitialNavigation(),
      /*withInMemoryScrolling({
        anchorScrolling: 'disabled',
        scrollPositionRestoration: 'top',
      }),*/
      withComponentInputBinding(),
      // withHashLocation(),
      withViewTransitions(),

      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        // onSameUrlNavigation: 'reload',
      }),
    ),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    appConfigInitializer,
    provideStore(),
    provideEffects(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
