import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { Post, postActions, selectComments, PostComment } from '@tt/data-access/posts';
import { AvatarCircleComponent, SvgIconComponent, TimeAgoPipe } from '@tt/common-ui';
import { DatePipe } from '@angular/common';
import { CommentComponent, PostInputComponent } from '../../ui';
import { GlobalStoreService } from '@tt/data-access/common';
import { Store } from '@ngrx/store';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent /*aka kind-of Clinical Orders Worklist with To-Do buttons*/
  implements OnInit
{
  store = inject(Store);

  profile = inject(GlobalStoreService).me;

  post = input<Post>();

  comments!: Signal<PostComment[]>;

  ngOnInit() {
    const postId = this.post()!.id;

    this.store.dispatch(postActions.loadComments({ postId }));

    this.comments = this.store.selectSignal(selectComments(postId));
  }

  onCommentCreated(text: string) {
    this.store.dispatch(
      postActions.createComment({
        payload: {
          text,
          authorId: this.profile()!.id,
          postId: this.post()!.id,
        }
      }),
    );
  }
}
