import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './components/categories.component';
import { CategoryCardComponent } from './components/category-card.component';
import { CategoryFormComponent } from './components/category-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryCardComponent,
    CategoryFormComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  exports: [CategoriesComponent],
})
export class CategoriesModule {}
