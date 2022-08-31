import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { LoginUserCommand } from '../interface/LoginUserCommand';
import { loginUser } from '../store/users.actions';

@Component({
  selector: 'app-login',
  template: `
    <div class="mx-auto flex w-1/3 flex-col space-y-4 p-8">
      <h2 class="title-2 text-center">Iniciar Sesión</h2>

      <form
        class="flex flex-col space-y-6"
        [formGroup]="loginForm"
        (ngSubmit)="onSubmit()">
        <div>
          <label class="form-label" for="name">Email </label>
          <input
            class="form-input"
            id="email"
            type="email"
            placeholder="Email"
            formControlName="email" />
        </div>
        <div>
          <label class="form-label" for="name">Contraseña </label>
          <input
            class="form-input"
            id="password"
            type="password"
            placeholder="Contraseña"
            formControlName="password" />
        </div>
        <button
          class="primary-button col-start-2"
          type="submit"
          [disabled]="!loginForm.valid">
          Enviar
        </button>
      </form>
      <a class="text-center hover:underline" routerLink="/register"
        >Crea una cuenta</a
      >
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(private store: Store<AppState>) {}

  onSubmit() {
    let user: LoginUserCommand = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };
    this.store.dispatch(loginUser({ user }));
    this.loginForm.reset();
  }
}
