import { inject, Injectable } from '@angular/core';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface';
import { map } from 'rxjs';
import { ApiService, Pageable } from '../../common';
import { CommentEndpoints, PostEndpoints } from './post.endpoints';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  api = inject(ApiService);

  createPost(payload: PostCreateDto) {
    return this.api.post<Post>(PostEndpoints.create, payload);
  }

  fetchPosts() {
    return this.api.get<Post[]>(PostEndpoints.getAll);
  }

  getCommunityPosts(communityId: number) {
    return this.api.get<Pageable<Post>>(PostEndpoints.getCommunityPosts(communityId));
  }

  createComment(payload: CommentCreateDto) {
    return this.api.post<PostComment>(CommentEndpoints.create, payload);
  }

  getCommentsByPostId(postId: number) {
    return this.api.get<Post>(PostEndpoints.read(postId)).pipe(map((res) => res.comments));
  }
}
