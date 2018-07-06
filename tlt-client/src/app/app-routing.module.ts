import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { UniqueComponent } from './unique/unique.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { state: 'list' } },
  { path: 'tag/:tag', component: ListComponent, data: { state: 'sublist' } },
  { path: 'post/:id', component: ViewComponent, data: { state: 'post' } },
  { path: 'unique/:slug', component: UniqueComponent, data: { state: 'post' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
