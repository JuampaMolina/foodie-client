import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { User, UserRole } from '../interface/user';
import { getUsers, updateUserRole } from '../store/users.actions';
import {
  selectAdminUsers,
  selectAdminUsersPage,
  selectAdminUsersTotalPages,
} from '../store/users.selectors';

const ROLE_LABELS: Record<UserRole, string> = {
  user: 'Usuario',
  admin: 'Administrador',
};

const ROLE_OPTIONS: UserRole[] = ['user', 'admin'];

@Component({
  selector: 'app-user-admin',
  template: `
    <h2 class="title-2 mb-4">Usuarios</h2>
    @if (users().length < 1) {
    <div class="surface-card py-16 text-center">
      <span class="text-lg font-semibold text-neutral-500 dark:text-neutral-400"
        >No hay usuarios</span
      >
    </div>
    }
    <div class="flex flex-col gap-3">
      @for (user of users(); track user._id) {
      <div
        class="surface-card grid grid-cols-3 items-center gap-3 p-4 sm:grid-cols-4">
        <div class="flex items-center gap-3">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
            {{ user.name.charAt(0).toUpperCase() }}
          </span>
          <span
            class="truncate font-semibold text-neutral-900 dark:text-white"
            >{{ user.name }}</span
          >
        </div>
        <span class="truncate text-neutral-500 dark:text-neutral-400">
          {{ user.email }}
        </span>
        <span class="col-span-2 sm:col-span-1">
          <select
            class="select-background form-input w-full cursor-pointer"
            (change)="onRoleChange(user, $event)">
            @for (option of roleOptions; track option) {
            <option [value]="option" [selected]="option === user.role">
              {{ roleLabels[option] }}
            </option>
            }
          </select>
        </span>
      </div>
      }
    </div>
    @if (totalPages() > 1) {
    <div class="mt-4 flex items-center justify-center gap-4">
      <button
        class="secondary-button"
        [disabled]="page() <= 1"
        (click)="goToPage(page() - 1)">
        Anterior
      </button>
      <span>Página {{ page() }} de {{ totalPages() }}</span>
      <button
        class="secondary-button"
        [disabled]="page() >= totalPages()"
        (click)="goToPage(page() + 1)">
        Siguiente
      </button>
    </div>
    }
  `,
  styles: [],
})
export class UserAdminComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);

  users = toSignal(this.store.select(selectAdminUsers), { initialValue: [] });
  page = toSignal(this.store.select(selectAdminUsersPage), { initialValue: 1 });
  totalPages = toSignal(this.store.select(selectAdminUsersTotalPages), {
    initialValue: 1,
  });

  readonly roleLabels = ROLE_LABELS;
  readonly roleOptions = ROLE_OPTIONS;

  getUsers(page: number = 1) {
    this.store.dispatch(getUsers({ page }));
  }

  goToPage(page: number) {
    this.getUsers(page);
  }

  onRoleChange(user: User, event: Event) {
    const role = (event.target as HTMLSelectElement).value as UserRole;
    if (role !== user.role) {
      this.store.dispatch(
        updateUserRole({ roleUpdate: { userId: user._id, role } })
      );
    }
  }

  ngOnInit() {
    this.getUsers();
  }
}
