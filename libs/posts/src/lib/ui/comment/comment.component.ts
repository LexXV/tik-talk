import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostComment } from '@tt/data-access/posts';
import { AvatarCircleComponent, TimeAgoPipe } from '@tt/common-ui';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-comment',
  imports: [AvatarCircleComponent, DatePipe, TimeAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  comment = input<PostComment>();
}
