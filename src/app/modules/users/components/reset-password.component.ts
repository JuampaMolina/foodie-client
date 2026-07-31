import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { resetPassword } from '../store/users.actions';
import { selectResetPasswordDone } from '../store/users.selectors';

@Component({
  selector: 'app-reset-password',
  template: `
    <div class="mx-auto flex w-full flex-col space-y-4 p-8 md:w-2/3 xl:w-1/2">
      <h2 class="title-2 text-center">Restablecer contraseña</h2>

      @if (!done()) {
      <form
        class="flex flex-col space-y-6"
        [formGroup]="form"
        (ngSubmit)="onSubmit()">
        <div>
          <label class="form-label" for="token">Token </label>
          <input
            class="form-input"
            id="token"
            type="text"
            placeholder="Token"
            formControlName="token" />
        </div>
        <div>
          <label class="form-label" for="password">Nueva contraseña </label>
          <input
            class="form-input"
            id="password"
            type="password"
            placeholder="Nueva contraseña"
            formControlName="password" />
        </div>
        <button
          class="primary-button col-start-2"
          type="submit"
          [disabled]="!form.valid">
          Enviar
        </button>
      </form>
      } @if (done()) {
      <div class="space-y-4 text-center">
        <p>Contraseña actualizada correctamente.</p>
        <a class="primary-button inline-flex" routerLink="/login"
          >Iniciar sesión</a
        >
      </div>
      }
    </div>
  `,
  styles: [],
  imports: [ReactiveFormsModule, RouterLink],
})
export class ResetPasswordComponent {
  private store = inject<Store<AppState>>(Store);
  private route = inject(ActivatedRoute);

  form = new FormGroup({
    token: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  done = toSignal(this.store.select(selectResetPasswordDone), {
    initialValue: false,
  });

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.form.patchValue({ token });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const { token, password } = this.form.value;
    this.store.dispatch(resetPassword({ token: token!, password: password! }));
  }
}
