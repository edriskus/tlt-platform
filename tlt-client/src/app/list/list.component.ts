import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from '../post';
import { ApiService } from '../api.service';
import { map, single, flatMap, take, filter } from 'rxjs/operators';
import * as removeMd from 'remove-markdown';
import { formatPostDate } from '../common.utils';
import { Store, select } from '@ngrx/store';
import { UpdatePostsAction, PostsState, GLOBAL_TAG, TagPostsState } from '../posts.store';
import { AuthState } from '../auth.store';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public posts$: Observable<Array<Post>>;
  public user$: Observable<AuthState>;
  public destroying: boolean;
  public tag: string = GLOBAL_TAG;

  constructor(
    private api: ApiService,
    private store: Store<any>,
    private scrollToService: ScrollToService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user$ = store.pipe(select('auth'));
  }

  ngOnDestroy() {
    this.destroying = true;
    this.store.dispatch(new UpdatePostsAction({
      scrollY: window.scrollY
    }, this.tag))
  }

  // @HostListener('window:scroll', ['$event']) onScroll(ev) {
  //   this.store.dispatch(new UpdatePostsAction({
  //     scrollY: window.scrollY
  //   }))
  // }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if(params['tag']) {
          this.tag = params['tag'];
        }
        this.posts$ = this.store.pipe(
          select('posts'),
          map((state: PostsState) => state[this.tag]),
          map((state: TagPostsState = {}) => {
            if(!state.posts) {
              this.api.getPosts(this.tag == GLOBAL_TAG ? null : this.tag).subscribe(
                posts => {
                  this.store.dispatch(new UpdatePostsAction({ posts, scrollY: 0 }, this.tag));
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
    )
  }

  public showTag(): boolean {
    return this.tag != GLOBAL_TAG;
  }

  public formatDate = formatPostDate;

  public removeMd(val: string): string {
    return removeMd(val);
  }

  public openPost(post: Post): void {
    if(this.tag == GLOBAL_TAG) {
      this.router.navigate([`/post/${ post.id }`])
    } else {
      this.router.navigate([`/post/${ post.id }`], { queryParams: { tag: this.tag }})
    }
  }
}
