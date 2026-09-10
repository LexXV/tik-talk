import { PostAuthor } from './post.interface';
import { Community } from '../../communities';

export function isCommunityAuthor(author: PostAuthor): author is Community {
  return 'name' in author;
}
