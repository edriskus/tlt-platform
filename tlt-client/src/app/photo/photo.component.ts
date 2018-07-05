import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post';
import { MatDialogRef } from '@angular/material';
import { generateRandomPlaceholderImage } from '../common.utils';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input() post: Post;
  public url: string;

  constructor(
    private dialogRef: MatDialogRef<PhotoComponent>
  ) { }

  ngOnInit() {
    this.url = this.post.image;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.post.image = this.url;
    this.dialogRef.close(this.url);
  }

  random(): void {
    this.url = generateRandomPlaceholderImage();
  }

}
