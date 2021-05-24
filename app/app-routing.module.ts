import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SliderComponent} from './shared/components/slider/slider.component';
import {ResultPageComponent} from './result-page/result-page.component';
import {MyListComponent} from './my-list/my-list.component';
import {SearchComponent} from './header/search/search.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'watch/:media/:id', component: ResultPageComponent},
  {path: 'mylist', component: MyListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
