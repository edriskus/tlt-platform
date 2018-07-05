import { Component, ViewChild } from '@angular/core';
import { environment } from '../environments/environment';
import { routerTransition } from './router.animations';
import { ScrollbarComponent } from 'ngx-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ routerTransition ],
})
export class AppComponent {

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

}
