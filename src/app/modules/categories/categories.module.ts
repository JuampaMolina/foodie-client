import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CategoriesComponent } from './components/categories.component';
import { CategoryCardComponent } from './components/category-card.component';
import { CategoryFormComponent } from './components/category-form.component';

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
