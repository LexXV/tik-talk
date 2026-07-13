import { Component, inject, input, OnInit, signal } from '@angular/core';
import { PostComment, Post, PostService } from '../../data';
import { AvatarCircleComponent, SvgIconComponent, TimeAgoPipe } from '@tt/common-ui';
import { DatePipe } from '@angular/common';
import { CommentComponent, PostInputComponent } from '../../ui';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '@tt/profile';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimeAgoPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent /*aka kind-of Clinical Orders Worklist with To-Do buttons*/
  implements OnInit
{
  postService = inject(PostService);

  profile = inject(ProfileService).me;

  post = input<Post>();
  comments = signal<PostComment[]>([]);

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCommentCreated(text: string) {
    await firstValueFrom(
      this.postService.createComment({
        text,
        authorId: this.profile()!.id,
        postId: this.post()!.id,
      }),
    );

    await this.onCreated();
  }

  async onCreated() {
    const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id));
    this.comments.set(comments);
  }
}
