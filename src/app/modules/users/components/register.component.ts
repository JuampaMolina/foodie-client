import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { RegisterUserCommand } from '../interface/RegisterUserCommand';
import { registerUser } from '../store/users.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  template: `
    <div class="surface-card mx-auto w-full max-w-md space-y-6 p-8">
      <div class="flex flex-col items-center gap-2">
        <span
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
          <i class="fa-solid fa-utensils text-lg"></i>
        </span>
        <h2 class="title-2 text-center text-3xl">Crear Cuenta</h2>
      </div>

      <form
        class="flex flex-col space-y-4"
        [formGroup]="registerForm"
        (ngSubmit)="onSubmit()">
        <div>
          <label class="form-label" for="name">Nombre</label>
          <input
            class="form-input"
            id="name"
            type="text"
            placeholder="Nombre"
            formControlName="name" />
          @if ( this.registerForm.get('name')?.hasError('required') &&
          showErrors ) {
          <small class="text-red-500"> El nombre es requerido </small>
          }
        </div>
        <div>
          <label class="form-label" for="email">Email</label>
          <input
            class="form-input"
            id="email"
            type="email"
            placeholder="Email"
            formControlName="email" />
          @if ( this.registerForm.get('email')?.hasError('required') &&
          showErrors ) {
          <small class="text-red-500"> El email es requerido </small>
          } @if ( !this.registerForm.get('email')?.hasError('required') &&
          this.registerForm.get('email')?.hasError('email') && showErrors ) {
          <small class="text-red-500">
            El email debe tener el siguiente formato: example&#64;example.com
          </small>
          }
        </div>
        <div>
          <label class="form-label" for="password">Contraseña</label>
          <input
            class="form-input"
            id="password"
            type="password"
            placeholder="Contraseña"
            formControlName="password" />
          @if ( this.registerForm.get('password')?.hasError('required') &&
          showErrors ) {
          <small class="text-red-500"> La contraseña es requerida </small>
          } @if ( !this.registerForm.get('password')?.hasError('required') &&
          this.registerForm.get('password')?.hasError('minlength') && showErrors
          ) {
          <small class="text-red-500">
            La contraseña debe tener al menos 4 carácteres
          </small>
          }
        </div>
        <button class="primary-button mt-2" type="submit">Enviar</button>
      </form>
      <a
        class="block text-center text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
        routerLink="/login"
        >Iniciar Sesión</a
      >
    </div>
  `,
  styles: [],
  imports: [ReactiveFormsModule, RouterLink],
})
export class RegisterComponent {
  private store = inject<Store<AppState>>(Store);

  registerForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  showErrors: boolean = false;

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
