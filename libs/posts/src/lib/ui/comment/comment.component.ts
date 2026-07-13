import { Component, input } from '@angular/core';
import { PostComment } from '../../data';
import { AvatarCircleComponent, TimeAgoPipe } from '@tt/common-ui';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, DatePipe, TimeAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent /*aka kind-of Clinical Orders statuses history*/ {
  comment = input<PostComment>();
}
