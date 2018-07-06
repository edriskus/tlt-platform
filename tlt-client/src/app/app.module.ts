import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { NgxMdModule } from 'ngx-md';
import { NgxMaskModule } from 'ngx-mask';
import { NgxStickyModule } from 'ng6-sticky';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatSlideToggleModule } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ScrollbarModule } from 'ngx-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewComponent } from './view/view.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { authReducer } from './auth.store';
import { postsReducer } from './posts.store';

import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ConfirmComponent } from './confirm/confirm.component';
import { PhotoComponent } from './photo/photo.component';
import { UniqueComponent } from './unique/unique.component';

const reducers: ActionReducerMap<any> = { authReducer };

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['auth'],
    rehydrate: true
  })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    ListComponent,
    EditComponent,
    UniqueComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    ConfirmComponent,
    PhotoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    NgxMdModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TextareaAutosizeModule,
    NgxMaskModule.forRoot(),
    ScrollToModule.forRoot(),
    ScrollbarModule,
    NgxStickyModule,
    StoreModule.forRoot({
      auth: authReducer,
      posts: postsReducer
    }, { metaReducers })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginComponent,
    ConfirmComponent,
    PhotoComponent
  ]
})
export class AppModule { }
