import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Post } from '../post';
import { ApiService } from '../api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../auth.store';
import { formatPostDate, generateRandomPlaceholderImage } from '../common.utils';
import { MatDialog } from '@angular/material';
import { PhotoComponent } from '../photo/photo.component';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-unique',
  templateUrl: './unique.component.html',
  styleUrls: ['./unique.component.scss']
})
export class UniqueComponent implements OnInit, AfterViewInit {

  public editMode: boolean;
  public tag: string;

  public post$: Observable<Post>;
  public user$: Observable<AuthState>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private store: Store<any>,
    private scrollToService: ScrollToService,
    private router: Router
  ) {
    this.user$ = store.pipe(select('auth'));
  }

  ngOnInit() {
    this.post$ = this.route.params.pipe(
      mergeMap(
        (params: Params) => {
          if(params['slug']) {
            return this.api.getUnique(params['slug']);
          }
          return of(null);
        }
      ),
      map(
        post => {
          if(!post) { this.back(); return new Post() }
          if(!post.image) {
            post.image = generateRandomPlaceholderImage();
          }
          return post;
        }
      )
    )
  }

  public back(): void {
    this.router.navigate([`/`]);
  }

  ngAfterViewInit() {
    this.scrollToService.scrollTo({
      target: 'top',
      duration: 400
    })
  }

  public updatePost(post: Post, old): void {
    Object.assign(old, post);
    this.toggleEdit(false)
  }

  public toggleEdit(val: boolean = !this.editMode): void {
    this.editMode = val;
  }

  public formatDate = formatPostDate;

  public stickyIsFixed: boolean = false;
  @HostListener('window:scroll', ['$event']) onscroll(ev) {
    if(window.scrollY >= 200) {
      this.stickyIsFixed = true;
    } else {
      this.stickyIsFixed = false;
    }
  }
}
