import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../data';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Debounce, GlobalStoreService } from '@tt/shared';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent /*aka kind-of Clinical Order Customization Page*/
  implements AfterViewInit
{
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  profile = inject(GlobalStoreService).me;

  feed = this.postService.posts;

  /*@HostListener('window:resize')
  //@Debounce(200)
  onWindowResize() {
    this.resizeFeed()
  }*/

  constructor() {
    firstValueFrom(this.postService.fetchPosts());

    fromEvent(window, 'resize')
      .pipe(debounceTime(200), takeUntilDestroyed())
      .subscribe(() => this.resizeFeed());
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  async onPostCreated(content: string) {
    await firstValueFrom(
      this.postService.createPost({
        title: 'Клёвый пост',
        content,
        authorId: this.profile()!.id,
      }),
    );
  }
}
