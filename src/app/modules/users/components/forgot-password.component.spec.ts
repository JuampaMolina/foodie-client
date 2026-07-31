import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { forgotPassword } from '../store/users.actions';
import { selectResetToken } from '../store/users.selectors';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [{ selector: selectResetToken, value: undefined }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();
  });

  it('should dispatch forgotPassword with the entered email', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.componentInstance.form.setValue({ email: 'ana@test.com' });

    fixture.componentInstance.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      forgotPassword({ email: 'ana@test.com' })
    );
  });

  it('should not dispatch when the email is invalid', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.componentInstance.form.setValue({ email: 'not-an-email' });

    fixture.componentInstance.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should show the reset token once available', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [ForgotPasswordComponent],
        providers: [
          provideRouter([]),
          provideMockStore({
            selectors: [{ selector: selectResetToken, value: 'reset-tok-123' }],
          }),
        ],
      })
      .compileComponents();

    const tokenFixture = TestBed.createComponent(ForgotPasswordComponent);
    tokenFixture.detectChanges();

    expect(tokenFixture.nativeElement.textContent).toContain('reset-tok-123');
  });
});
