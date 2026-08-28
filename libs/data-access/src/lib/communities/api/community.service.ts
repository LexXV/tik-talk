import { inject, Injectable } from '@angular/core';
import { ApiService, Pageable } from '../../common';
import { CommunityEndpoints } from './community.endpoints';
import { Community } from '..';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  #api = inject(ApiService);

  getCommunities(params: Record<string, any>) {
    return this.#api.get<Pageable<Community>>(CommunityEndpoints.getAll, { params });
  }

  joinCommunity(communityId: number) {
    return this.#api.post<string>(CommunityEndpoints.join(communityId), {});
  }

  leaveCommunity(communityId: number) {
    return this.#api.delete<string>(CommunityEndpoints.leave(communityId));
  }
}
