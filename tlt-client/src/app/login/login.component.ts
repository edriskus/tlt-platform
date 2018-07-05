import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { LoginAuthAction, AuthState } from '../auth.store';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ResetPostsAction } from '../posts.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user$: Observable<AuthState>;
  public form: FormGroup;
  public logging: boolean;
  public submitAttempted: boolean;
  public error: string;

    constructor(
      private api: ApiService,
      private dialogRef: MatDialogRef<LoginComponent>,
      private store: Store<any>,
      private fb: FormBuilder
    ) {
      this.user$ = store.pipe(select('auth'));
    }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    })
    this.form.valueChanges.subscribe(
      res => this.error = null
    )
  }

  public hasError(name: string): boolean {
    if(!this.form) return false;
    let control: AbstractControl = this.form.get(name);
    return this.submitAttempted && !control.valid;
  }

  public formValid(): boolean {
    return this.form.valid;
  }

  public login(): void {
    if(this.logging) return;
    this.submitAttempted = true;
    if(!this.formValid()) return;
    this.logging = true;

    this.api.login(this.form.value).subscribe(
      res => {
        this.logging = false;
        this.store.dispatch(new LoginAuthAction(new AuthState(
          res.user.username, res.token
        )))
        this.store.dispatch(new ResetPostsAction());
        this.dialogRef.close();
      },
      err => {
        this.logging = false;
        this.error = err.error ? err.error.message : 'Something went wrong!';
      }
    )
  }

}
