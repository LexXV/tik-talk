import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../interfaces/profile.interface';
import { Pageable } from '../interfaces/pageable.interface';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/account/';

  me = signal<Profile | null>(null);
  filteredProfiles = signal<Profile[]>([]);

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}me`)
      .pipe(
        tap(res => this.me.set(res))
      );
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}${id}`);
  }

  getSubscribersShortList(subsAmount = 3) {
    return this.http.get<Pageable<Profile>>(`${this.baseApiUrl}subscribers/`)
      .pipe(
        map(res => res.items.slice(0, subsAmount))
      );
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(
      `${this.baseApiUrl}me`,
      profile
    );
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);

    return this.http.post<Profile>(
      `${this.baseApiUrl}upload_image`,
      fd
    );
  }

  filterProfiles(params: Record<string, any>) { // with "any" TypeScript is actually disabled. And it's highly recommended to use "unknown"
    return this.http.get<Pageable<Profile>>(
      `${this.baseApiUrl}accounts`,
      {
        params
      }
    ).pipe(
      tap(res => this.filteredProfiles.set(res.items))
    );
  }
}
