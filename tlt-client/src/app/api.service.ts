import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Post } from './post';
import { map } from 'rxjs/operators';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private notify: NotifyService
  ) { }

  getPosts(tag: string): Observable<Array<Post>> {
    let params: any = {};
    if(tag) params.tags = [tag];
    return this.http.get<Array<Post>>(`/post`, { params }).pipe(
      map(posts => posts.sort((a: Post, b: Post) => {
        if(a.date < b.date) return 1;
        else if(a.date == b.date) return 0;
        return -1;
      }))
    );
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`/post/${id}`);
  }

  getUnique(slug: string): Observable<Post> {
    return this.http.get<Post>(`/post/unique/${slug}`);
  }

  savePost(post: Post): Observable<any> {
    if(!post.id) {
      // for(let i = 0; i < 20; i++) {
      //   this.http.post<any>(`/post`, post).pipe(
      //     map(res => {
      //       this.notify.snackbar('Post created!');
      //       return res;
      //     })
      //   ).subscribe(res => null);
      // }
      return this.http.post<any>(`/post`, post).pipe(
        map(res => {
          this.notify.snackbar('Post created!');
          return res;
        })
      );
    } else {
      return this.http.patch<any>(`/post/${post.id}`, post).pipe(
        map(res => {
          this.notify.snackbar('Post saved!');
          return res;
        })
      );
    }
  }

  removePost(post: Post): Observable<any> {
    return this.http.delete<any>(`/post/${post.id}`).pipe(
      map(res => {
        this.notify.snackbar('Post removed!');
        return res;
      })
    );
  }

  login({ username, password }): Observable<any> {
    return this.http.post<any>(`/login`, {
      username, password
    });
  }

}
