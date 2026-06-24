import { Component, inject, input, OnInit, signal } from '@angular/core';
import { PostComment, Post } from '../../../data/interfaces/post.interface';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { DatePipe } from '@angular/common';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { PostInputComponent } from '../post-input/post-input.component';
import { CommentComponent } from './comment/comment.component';
import { PostService } from '../../../data/services/post.service';
import { firstValueFrom } from 'rxjs';
import { TimeAgoPipe } from '../../../helpers/pipes/time-ago.pipe';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimeAgoPipe
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent /*aka kind-of Clinical Orders Worklist with To-Do buttons*/ implements OnInit {
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
        postId: this.post()!.id
      })
    );

    await this.onCreated();
  }

  async onCreated() {
    const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id));
    this.comments.set(comments);
  }
}
