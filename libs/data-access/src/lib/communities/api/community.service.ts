import { inject, Injectable } from '@angular/core';
import { ApiService, Pageable } from '../../common';
import { CommunityEndpoints } from './community.endpoints';
import { Community } from '..';
import { CreateCommunityDto } from '../interfaces/community.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  #api = inject(ApiService);

  getCommunities(params: Record<string, any>) {
    return this.#api.get<Pageable<Community>>(CommunityEndpoints.getAll, { params });
  }

  createCommunity(data: CreateCommunityDto) {
    return this.#api.post<Community>(CommunityEndpoints.create, data);
  }

  joinCommunity(communityId: number) {
    return this.#api.post<string>(CommunityEndpoints.join(communityId), {});
  }

  leaveCommunity(communityId: number) {
    return this.#api.delete<string>(CommunityEndpoints.leave(communityId));
  }
}
