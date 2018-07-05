import { Component, OnInit, Input, EventEmitter, Output, OnChanges, HostListener } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Post } from '../post';
import { ApiService } from '../api.service';
import * as moment from 'moment';
import { NotifyService } from '../notify.service';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ResetPostsAction } from '../posts.store';
import { AuthState } from '../auth.store';
import { PhotoComponent } from '../photo/photo.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {

  @Input('post') postSource: Post;
  @Input() user: AuthState;

  @Output('close') closeEmitter = new EventEmitter();

  public post: Post;
  public postResult: Post;
  public postSourceString: string;

  public saving: boolean;
  public removing: boolean;
  public submitAttempted: boolean;

  public date: string;

  public form: FormGroup;

  constructor(
    private api: ApiService,
    private router: Router,
    private notify: NotifyService,
    private fb: FormBuilder,
    private store: Store<any>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // this.post = { ...this.postSource };
    this.presetDate();
    this.buildForm();
  }

  ngOnChanges() {
    this.postSourceString = JSON.stringify(this.postSource);
    this.postResult = { ... this.postSource };
    this.post = { ...this.postSource };
    this.presetDate();
    if(this.form) {
      this.form.setValue({
        title: (this.post || new Post()).title || null,
        content: (this.post || new Post()).content || null,
      });
    }
  }

  @HostListener('window:keypress', ['$event']) onkeypress(ev): void {
    if(ev.keyCode == 27) {
      this.close();
    } else if ((ev.which == 115 && ev.ctrlKey) || (ev.which == 19)) {
      this.save(this.post);
    } else return;
    ev.preventDefault();
    ev.stopPropagation();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      title: [null, Validators.required],
      content: [null, Validators.required]
    })
    this.form.setValue({
      title: (this.post || new Post()).title || null,
      content: (this.post || new Post()).content || null,
    });
    this.form.valueChanges.subscribe(
      changes => {
        Object.assign(this.post, this.form.value);
      }
    )
  }

  private presetDate(): void {
    if(!this.post.date) {
      this.post.date = moment().valueOf();
    }
    this.date = moment(this.post.date).format('YYYY.MM.DD HH:mm');
  }

  public dateChanges(date): void {
    this.post.date = this.post.date = moment(date, 'YYYY.MM.DD HH:mm').valueOf();
  }

  public dateValid(): boolean {
    return moment(this.date, 'YYYY.MM.DD HH:mm').isValid();
  }

  public formValid(): boolean {
    return this.form.valid && this.dateValid();
  }

  public hasError(name: string): boolean {
    if(!this.form) return false;
    let control: AbstractControl = this.form.get(name);
    return this.submitAttempted && !control.valid;
  }

  public save(post: Post): void {
    if(this.saving || !this.dataChanged()) return;
    this.submitAttempted = true;
    if(!this.formValid()) return;
    this.saving = true;

    let isNew = !!post.id;
    Object.assign(post, this.form.value);
    post.date = this.post.date = moment(this.date, 'YYYY.MM.DD HH:mm').valueOf();
    post.excerpt = post.content.length > 250 ? post.content.substr(0, 250) + '...' : post.content;
    this.api.savePost(post).subscribe(
      res => {
        this.saving = false;
        this.updateList();
        this.postResult = { ...res };
        this.postSourceString = JSON.stringify(post);
      },
      err => {
        // this.saveError = err;
      }
    )
  }

  public remove(post: Post): void {
    if(this.removing) return;
    this.notify.prompt('Remove post?', 'This cannot be undone.').subscribe(
      res => {
        this.removing = true;
        this.api.removePost(post).subscribe(
          res => {
            this.removing = false;
            this.updateList();
            this.router.navigate(['/'])
          },
          err => {
            // this.saveError = err;
          }
        )
      }
    )
  }

  public close(): void {
    if(this.postResult.id) {
      this.closeEmitter.emit(this.postResult)
    } else {
      this.router.navigate([`/`]);
    }
  }

  public updateList(): void {
    this.store.dispatch(new ResetPostsAction());
    // this.api.getPosts().subscribe(
    //   posts => {

    //   }
    // )
  }

  public photoUploader(post: Post): void {
    let ref = this.dialog.open(PhotoComponent, {
      width: '400px'
    });
    ref.componentInstance.post = post;
    ref.afterClosed().subscribe(
      res => {
        // Do nothing
      }
    )
  }

  public dataChanged(): boolean {
    return this.postSourceString != JSON.stringify(this.post);
  }

}
