import { inject, provideAppInitializer } from '@angular/core';
import { AppConfigService } from './app-config.service';

export const appConfigInitializer = provideAppInitializer(async () => {
  await inject(AppConfigService).load();
});
