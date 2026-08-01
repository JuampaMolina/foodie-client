import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { forgotPassword } from '../store/users.actions';
import { selectResetToken } from '../store/users.selectors';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="surface-card mx-auto w-full max-w-md space-y-6 p-8">
      <div class="flex flex-col items-center gap-2">
        <span
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
          <i class="fa-solid fa-key text-lg"></i>
        </span>
        <h2 class="title-2 text-center text-3xl">Recuperar contraseña</h2>
      </div>

      @if (!resetToken()) {
      <form
        class="flex flex-col space-y-4"
        [formGroup]="form"
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
        <button
          class="primary-button mt-2"
          type="submit"
          [disabled]="!form.valid">
          Enviar
        </button>
      </form>
      } @if (resetToken()) {
      <div class="space-y-4 text-center">
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          Este proyecto todavía no envía emails. Tu token de recuperación es:
        </p>
        <p
          class="font-mono break-all rounded-xl bg-neutral-100 p-3 text-sm dark:bg-neutral-800">
          {{ resetToken() }}
        </p>
        <a
          class="primary-button inline-flex"
          [routerLink]="['/reset-password']"
          [queryParams]="{ token: resetToken() }">
          Continuar
        </a>
      </div>
      }

      <a
        class="block text-center text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
        routerLink="/login"
        >Volver a iniciar sesión</a
      >
    </div>
  `,
  styles: [],
  imports: [ReactiveFormsModule, RouterLink],
})
export class ForgotPasswordComponent {
  private store = inject<Store<AppState>>(Store);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  resetToken = toSignal(this.store.select(selectResetToken));

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(forgotPassword({ email: this.form.value.email! }));
  }
}
