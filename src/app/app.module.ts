import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ItemsModule } from './modules/items/items.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducers } from './store/app.reducers';
import { appEffects } from './store/app.effects';
import { CategoriesModule } from './modules/categories/categories.module';
import { HomeComponent } from './views/home/home.component';
import { HomeModule } from './views/home/home.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { AdminModule } from './views/admin/admin.module';
import { AdminRoutingModule } from './views/admin/admin-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ItemsModule,
    CategoriesModule,
    HomeModule,
    AdminModule,
    NavbarModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(appEffects),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
