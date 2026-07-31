import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { User } from '../interface/user';
import {
  selectAdminUsers,
  selectAdminUsersPage,
  selectAdminUsersTotalPages,
} from '../store/users.selectors';
import { updateUserRole } from '../store/users.actions';
import { UserAdminComponent } from './user-admin.component';

describe('UserAdminComponent', () => {
  let fixture: ComponentFixture<UserAdminComponent>;
  let store: MockStore;

  const users: User[] = [
    { _id: '1', name: 'Ana', email: 'ana@test.com', role: 'user' },
    { _id: '2', name: 'Bea', email: 'bea@test.com', role: 'admin' },
  ];

  async function createFixture(
    page: number,
    totalPages: number
  ): Promise<ComponentFixture<UserAdminComponent>> {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [UserAdminComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAdminUsers, value: users },
              { selector: selectAdminUsersPage, value: page },
              { selector: selectAdminUsersTotalPages, value: totalPages },
            ],
          }),
        ],
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
    const created = TestBed.createComponent(UserAdminComponent);
    created.detectChanges();
    return created;
  }

  function getSelects(
    testFixture: ComponentFixture<UserAdminComponent>
  ): HTMLSelectElement[] {
    return Array.from(testFixture.nativeElement.querySelectorAll('select'));
  }

  beforeEach(async () => {
    fixture = await createFixture(1, 1);
  });

  it('should render one role selector per user, selected on their current role', () => {
    const selects = getSelects(fixture);
    expect(selects.length).toBe(users.length);
    expect(selects[0].value).toBe('user');
    expect(selects[1].value).toBe('admin');
  });

  it('should not show pagination controls when there is a single page', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Página');
  });

  it('should show pagination controls when there is more than one page', async () => {
    const pagedFixture = await createFixture(1, 3);
    expect(pagedFixture.nativeElement.textContent).toContain('Página 1 de 3');
  });

  it('should dispatch updateUserRole when a different role is picked', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const select = getSelects(fixture)[0];
    select.value = 'admin';
    select.dispatchEvent(new Event('change'));

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateUserRole({ roleUpdate: { userId: '1', role: 'admin' } })
    );
  });

  it('should not dispatch when the selected role is the same as the current one', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const select = getSelects(fixture)[0];
    select.value = 'user';
    select.dispatchEvent(new Event('change'));

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
