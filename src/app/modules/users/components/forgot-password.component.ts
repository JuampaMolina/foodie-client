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
    <div class="mx-auto flex w-full flex-col space-y-4 p-8 md:w-2/3 xl:w-1/2">
      <h2 class="title-2 text-center">Recuperar contraseña</h2>

      @if (!resetToken()) {
      <form
        class="flex flex-col space-y-6"
        [formGroup]="form"
        (ngSubmit)="onSubmit()">
        <div>
          <label class="form-label" for="email">Email </label>
          <input
            class="form-input"
            id="email"
            type="email"
            placeholder="Email"
            formControlName="email" />
        </div>
        <button
          class="primary-button col-start-2"
          type="submit"
          [disabled]="!form.valid">
          Enviar
        </button>
      </form>
      } @if (resetToken()) {
      <div class="space-y-4 text-center">
        <p>
          Este proyecto todavía no envía emails. Tu token de recuperación es:
        </p>
        <p
          class="font-mono break-all rounded bg-slate-200 p-2 text-sm dark:bg-slate-700">
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

      <a class="text-center hover:underline" routerLink="/login"
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
