import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemsModule } from './modules/items/items.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { AdminModule } from './views/admin/admin.module';
import { HomeModule } from './views/home/home.module';
import { appReducers } from './store/app.reducers';
import { appEffects } from './store/app.effects';
import { environment } from '../environments/environment.prod';

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
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
