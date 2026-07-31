import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { LoginUserCommand } from '../interface/LoginUserCommand';
import { loginUser } from '../store/users.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="surface-card mx-auto w-full max-w-md space-y-6 p-8">
      <div class="flex flex-col items-center gap-2">
        <span
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
          <i class="fa-solid fa-utensils text-lg"></i>
        </span>
        <h2 class="title-2 text-center text-3xl">Iniciar Sesión</h2>
      </div>

      <form
        class="flex flex-col space-y-4"
        [formGroup]="loginForm"
        (ngSubmit)="onSubmit()">
        <div>
          <label class="form-label" for="email">Email</label>
          <input
            class="form-input"
            id="email"
            type="email"
            placeholder="Email"
            formControlName="email" />
        </div>
        <div>
          <label class="form-label" for="password">Contraseña</label>
          <input
            class="form-input"
            id="password"
            type="password"
            placeholder="Contraseña"
            formControlName="password" />
        </div>
        <button
          class="primary-button mt-2"
          type="submit"
          [disabled]="!loginForm.valid">
          Enviar
        </button>
      </form>
      <div class="flex flex-col items-center gap-2 text-sm">
        <a
          class="font-medium text-brand-700 hover:underline dark:text-brand-400"
          routerLink="/register"
          >Crea una cuenta</a
        >
        <a
          class="text-neutral-500 hover:underline dark:text-neutral-400"
          routerLink="/forgot-password"
          >¿Olvidaste tu contraseña?</a
        >
      </div>
    </div>
  `,
  styles: [],
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  private store = inject<Store<AppState>>(Store);

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    let user: LoginUserCommand = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };
    this.store.dispatch(loginUser({ user }));
    this.loginForm.reset();
  }
}
