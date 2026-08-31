import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  AfterViewInit,
  HostListener,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import { postActions, selectPosts } from '@tt/data-access/posts';
import { debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Debounce } from '@tt/shared';
import { Store } from '@ngrx/store';
import { GlobalStoreService } from '@tt/data-access/common';

@Component({
  selector: 'lib-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFeedComponent implements AfterViewInit {
  store = inject(Store);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  ngZone = inject(NgZone);

  profile = inject(GlobalStoreService).me;

  feed = this.store.selectSignal(selectPosts);

  /*@HostListener('window:resize')
  //@Debounce(200)
  onWindowResize() {
    this.resizeFeed()
  }*/

  constructor() {
    this.store.dispatch(postActions.loadPosts());

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
    this.store.dispatch(
      postActions.createPost({
        payload: {
          title: 'Клёвый пост',
          content,
          authorId: this.profile()!.id,
        },
      }),
    );
  }
}
