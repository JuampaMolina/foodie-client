import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './modules/items/components/items.component';
import { CategoriesComponent } from './modules/categories/components/categories.component';
import { HomeComponent } from './views/home/home.component';
import { AdminComponent } from './views/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
