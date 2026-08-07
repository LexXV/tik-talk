import { inject, Injectable } from '@angular/core';
import { Profile, ProfileEndpoints } from '..';
import { ApiService, GlobalStoreService, Pageable } from '../../common';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  api = inject(ApiService);
  #globalStoreService = inject(GlobalStoreService);

  getTestAccounts() {
    return this.api.get<Profile[]>(ProfileEndpoints.getTestAccounts);
  }

  getMe() {
    return this.api
      .get<Profile>(ProfileEndpoints.getMe)
      .pipe(tap((res) => this.#globalStoreService.me.set(res)));
  }

  getAccount(id: string) {
    return this.api.get<Profile>(ProfileEndpoints.read(id));
  }

  getSubscribersShortList(subsAmount = 3) {
    return this.api
      .get<Pageable<Profile>>(ProfileEndpoints.getSubscribers)
      .pipe(map((res) => res.items.slice(0, subsAmount)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.api.patch<Profile>(ProfileEndpoints.updateMe, profile);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);

    return this.api.post<Profile>(ProfileEndpoints.uploadAvatar, fd);
  }

  filterProfiles(params: Record<string, any>) {
    return this.api.get<Pageable<Profile>>(ProfileEndpoints.getAccounts, {
      params,
    });
  }
}
