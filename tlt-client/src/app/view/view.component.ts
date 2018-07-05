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
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, AfterViewInit {

  public post$: Observable<Post>;
  public editMode: boolean;

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

  @HostListener('window:keypress', ['$event']) onkeypress(ev): void {
    if(ev.keyCode == 27 && !this.editMode) {
      this.router.navigate([`/`]);
    } else return;
    ev.preventDefault();
    ev.stopPropagation();
  }

  ngOnInit() {
    this.post$ = this.route.params.pipe(
      mergeMap(
        (params: Params) => {
          if(params['id'] && params['id'] != 'new') {
            return this.api.getPost(params['id']);
          } else {
            this.editMode = true;
            return of(new Post());
          }
        }
      ),
      map(
        post => {
          if(!post.image) {
            post.image = generateRandomPlaceholderImage();
          }
          return post;
        }
      )
    )
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
