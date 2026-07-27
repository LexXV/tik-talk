import { ProfileEndpoints } from './api/profile.endpoints';
import { Profile } from './interfaces/profile.interface';
import { ProfileService } from './api/profile.service';

export * from './store';

export type {
  Profile
};

export {
  ProfileEndpoints,
  ProfileService
};
