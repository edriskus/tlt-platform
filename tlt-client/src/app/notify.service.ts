import { Injectable } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { ConfirmComponent } from './confirm/confirm.component';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  public snackbar(message: string): void {
    this.snackBar.open(message, null, { duration: 1500 });
  }

  public prompt(title: string, message: string): Observable<any> {
    let ref = this.dialog.open(ConfirmComponent, {
      width: '400px'
    });
    ref.componentInstance.title = title;
    ref.componentInstance.message = message;
    return ref.afterClosed().pipe(
      map(res => {
        if(!res) return Observable.throw(res);
        return res;
      })
    );
  }
}
