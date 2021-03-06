import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, map, take } from 'rxjs/operators';
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

  @HostListener('window:keypress', ['$event']) onkeypress(ev): void {
    if(ev.keyCode == 27 && !this.editMode) {
      this.back();
    } else return;
    ev.preventDefault();
    ev.stopPropagation();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: Params) => {
        if(params['tag']) this.tag = params['tag'];
      }
    )
    this.post$ = this.route.params.pipe(
      mergeMap(
        (params: Params) => {
          if(params['id'] && params['id'] != 'new') {
            return this.api.getPost(params['id']);
          } else {
            return this.store.pipe(select('auth'), take(1), mergeMap(
              auth => {
                if(auth && auth.token) {
                  this.editMode = true;
                  return of(new Post());
                } else {
                  this.back();
                  return throwError(null);
                }

              }
            ))
          }
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
    this.router.navigate([this.tag ? `/tag/${ this.tag }` : `/`]);
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
