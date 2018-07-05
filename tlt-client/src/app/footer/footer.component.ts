import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private sequence: string = '';
  private phrase: string = 'kukis';
  private timeout: any;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  @HostListener('window:keyup', ['$event']) onKeyUp(ev) {
    if(this.timeout) clearTimeout(this.timeout);
    let key = ev.key;
    this.timeout = setTimeout(() => this.sequence = '', 500);
    this.sequence += key;
    if(this.sequence == this.phrase) this.seqAction();
  }

  public seqAction(): void {
    let dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

}
