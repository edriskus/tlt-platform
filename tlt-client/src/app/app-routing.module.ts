import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { state: 'list' } },
  { path: 'post/:id', component: ViewComponent, data: { state: 'post' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
