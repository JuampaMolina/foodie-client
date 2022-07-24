import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './components/categories.component';
import { CategoryCardComponent } from './components/category-card.component';
import { CategoryFormComponent } from './components/category-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryCardComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [CategoriesComponent]
})
export class CategoriesModule { }
