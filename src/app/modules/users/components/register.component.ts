import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { RegisterUserCommand } from '../interface/RegisterUserCommand';
import { registerUser } from '../store/users.actions';

@Component({
  selector: 'app-register',
  template: `
    <div class="mx-auto flex w-1/3 flex-col space-y-4 p-8">
      <h2 class="title-2 text-center">Crear Cuenta</h2>

      <form
        class="flex flex-col space-y-6"
        [formGroup]="registerForm"
        (ngSubmit)="onSubmit()">
        <div>
          <label class="form-label" for="name">Nombre </label>
          <input
            class="form-input"
            id="text"
            type="name"
            placeholder="Nombre"
            formControlName="name" />
          <small
            class="text-red-400"
            *ngIf="
              this.registerForm.get('name')?.hasError('required') && showErrors
            ">
            El nombre es requerido
          </small>
        </div>
        <div>
          <label class="form-label" for="name">Email </label>
          <input
            class="form-input"
            id="email"
            type="email"
            placeholder="Email"
            formControlName="email" />
          <small
            class="text-red-400"
            *ngIf="
              this.registerForm.get('email')?.hasError('required') && showErrors
            ">
            El email es requerido
          </small>
          <small
            class="text-red-400"
            *ngIf="
              !this.registerForm.get('email')?.hasError('required') &&
              this.registerForm.get('email')?.hasError('email') &&
              showErrors
            ">
            El email debe tener el siguiente formato: example@example.com
          </small>
        </div>
        <div>
          <label class="form-label" for="name">Contraseña </label>
          <input
            class="form-input"
            id="password"
            type="password"
            placeholder="Contraseña"
            formControlName="password" />
          <small
            class="text-red-400"
            *ngIf="
              this.registerForm.get('password')?.hasError('required') &&
              showErrors
            ">
            La contraseña es requerida
          </small>
          <small
            class="text-red-400"
            *ngIf="
              !this.registerForm.get('password')?.hasError('required') &&
              this.registerForm.get('password')?.hasError('minlength') &&
              showErrors
            ">
            La contraseña debe tener al menos 4 carácteres
          </small>
        </div>
        <button class="primary-button col-start-2" type="submit">Enviar</button>
      </form>
      <a class="text-center hover:underline" routerLink="/login"
        >Iniciar Sesión</a
      >
    </div>
  `,
  styles: [],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  showErrors: boolean = false;

  constructor(private store: Store<AppState>) {}

  onSubmit() {
    if (this.registerForm.invalid) {
      this.showErrors = true;
      return;
    }
    this.showErrors = false;
    let user: RegisterUserCommand = {
      name: this.registerForm.value.name!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
    };
    this.store.dispatch(registerUser({ user }));
    this.registerForm.reset();
  }
}
