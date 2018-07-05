import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../post';
import { ApiService } from '../api.service';
import { map, single, flatMap, take, filter } from 'rxjs/operators';
import * as removeMd from 'remove-markdown';
import { formatPostDate } from '../common.utils';
import { Store, select } from '@ngrx/store';
import { UpdatePostsAction, PostsState } from '../posts.store';
import { AuthState } from '../auth.store';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public posts$: Observable<Array<Post>>;
  public user$: Observable<AuthState>;
  public destroying: boolean;

  constructor(
    private api: ApiService,
    private store: Store<any>,
    private scrollToService: ScrollToService
  ) {
    this.user$ = store.pipe(select('auth'));
  }

  ngOnDestroy() {
    this.destroying = true;
    this.store.dispatch(new UpdatePostsAction({
      scrollY: window.scrollY
    }))
  }

  // @HostListener('window:scroll', ['$event']) onScroll(ev) {
  //   this.store.dispatch(new UpdatePostsAction({
  //     scrollY: window.scrollY
  //   }))
  // }

  ngOnInit() {
    this.posts$ = this.store.pipe(
      select('posts'),
      map((state: PostsState) => {
        if(!state.posts) {
          this.api.getPosts().subscribe(
            posts => {
              this.store.dispatch(new UpdatePostsAction({ posts, scrollY: 0 }));
              return posts;
            }
          )
          return null;
        }
        if(!this.destroying) {
          this.scrollToService.scrollTo({
            offset: state.scrollY,
            duration: 400
          })
        }
        return state.posts;
      }),
      filter(val => {
        return Array.isArray(val)
      })
    );
  }

  public formatDate = formatPostDate;

  public removeMd(val: string): string {
    return removeMd(val);
  }
}
