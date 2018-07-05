import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;

  @HostListener('window:keyup', ['$event']) onkeyup(ev) {
    if(ev.keyCode == 13) this.confirm();
  }

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>
  ) { }

  ngOnInit() {
  }

  public confirm(): void {
    this.dialogRef.close(true);
  }

  public cancel(): void {
    this.dialogRef.close(false);
  }

}
