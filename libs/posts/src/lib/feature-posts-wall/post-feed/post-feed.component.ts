import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  AfterViewInit,
  HostListener,
  ChangeDetectionStrategy,
  NgZone,
  input,
  output,
} from '@angular/core';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import { Post } from '@tt/data-access/posts';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Debounce } from '@tt/shared';

@Component({
  selector: 'lib-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFeedComponent implements AfterViewInit {
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  ngZone = inject(NgZone);

  feed = input<Post[]>([]);
  canCreatePost = input(true);

  avatarUrl = input<string | null>();
  avatarFallbackUrl = input('/assets/imgs/avatar-placeholder.png');

  createPost = output<string>();

  /*@HostListener('window:resize')
  //@Debounce(200)
  onWindowResize() {
    this.resizeFeed()
  }*/

  constructor() {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(debounceTime(200), takeUntilDestroyed())
        .subscribe(() => this.resizeFeed());
    });
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  onPostCreated(content: string) {
    this.createPost.emit(content);
  }
}
