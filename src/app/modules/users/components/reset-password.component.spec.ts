import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { resetPassword } from '../store/users.actions';
import { selectResetPasswordDone } from '../store/users.selectors';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let store: MockStore;

  const activatedRouteStub = {
    snapshot: {
      queryParamMap: convertToParamMap({ token: 'from-query-param' }),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        provideMockStore({
          selectors: [{ selector: selectResetPasswordDone, value: false }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ResetPasswordComponent);
    fixture.detectChanges();
  });

  it('should prefill the token from the query param', () => {
    expect(fixture.componentInstance.form.value.token).toBe('from-query-param');
  });

  it('should dispatch resetPassword with the token and new password', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.componentInstance.form.patchValue({ password: 'newpass' });

    fixture.componentInstance.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      resetPassword({ token: 'from-query-param', password: 'newpass' })
    );
  });

  it('should not dispatch when the password is too short', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.componentInstance.form.patchValue({ password: '12' });

    fixture.componentInstance.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should show the confirmation once resetPasswordDone is true', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [ResetPasswordComponent],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          provideMockStore({
            selectors: [{ selector: selectResetPasswordDone, value: true }],
          }),
        ],
      })
      .compileComponents();

    const doneFixture = TestBed.createComponent(ResetPasswordComponent);
    doneFixture.detectChanges();

    expect(doneFixture.nativeElement.textContent).toContain(
      'Contraseña actualizada correctamente'
    );
  });
});
