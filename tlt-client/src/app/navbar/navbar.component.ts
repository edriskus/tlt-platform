import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState, LogoutAuthAction } from '../auth.store';
import { ResetPostsAction } from '../posts.store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public title: string = environment.title;
  public user$: Observable<AuthState>;

  constructor(
    private store: Store<any>
  ) {
    this.user$ = store.pipe(select('auth'));
  }

  ngOnInit() {
  }

  logout() {
    this.store.dispatch(new LogoutAuthAction());
    this.store.dispatch(new ResetPostsAction());
  }

}
