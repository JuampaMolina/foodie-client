import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CategoryImageUploadService } from '../services/category-image-upload.service';
import { CategoryFormComponent } from './category-form.component';

describe('CategoryFormComponent', () => {
  let fixture: ComponentFixture<CategoryFormComponent>;
  let component: CategoryFormComponent;
  let uploadService: jasmine.SpyObj<CategoryImageUploadService>;

  const selectFile = (file: File) => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    uploadService = jasmine.createSpyObj('CategoryImageUploadService', [
      'upload',
    ]);

    await TestBed.configureTestingModule({
      imports: [CategoryFormComponent],
      providers: [
        { provide: CategoryImageUploadService, useValue: uploadService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('selects and deselects a stock image on click', () => {
    const stockPath = component.stockImages[0].path;

    component.selectImage(stockPath);
    expect(component.categoryForm.value.image).toBe(stockPath);

    component.selectImage(stockPath);
    expect(component.categoryForm.value.image).toBe('');
  });

  it('uploads the selected file and sets the returned URL as the image', () => {
    uploadService.upload.and.returnValue(
      of(
        'https://res.cloudinary.com/demo/image/upload/v1/foodie/categories/x.png'
      )
    );
    const file = new File(['x'], 'icon.png', { type: 'image/png' });

    selectFile(file);

    expect(uploadService.upload).toHaveBeenCalledWith(file);
    expect(component.categoryForm.value.image).toBe(
      'https://res.cloudinary.com/demo/image/upload/v1/foodie/categories/x.png'
    );
    expect(component.uploading()).toBeFalse();
  });

  it('shows a preview tile for a custom uploaded image, not matching any stock icon', () => {
    uploadService.upload.and.returnValue(
      of(
        'https://res.cloudinary.com/demo/image/upload/v1/foodie/categories/x.png'
      )
    );
    selectFile(new File(['x'], 'icon.png', { type: 'image/png' }));

    expect(component.customImagePreview()).toBe(
      'https://res.cloudinary.com/demo/image/upload/v1/foodie/categories/x.png'
    );
  });

  it('shows an error and clears the uploading state when the upload fails', () => {
    uploadService.upload.and.returnValue(throwError(() => new Error('boom')));

    selectFile(new File(['x'], 'icon.png', { type: 'image/png' }));

    expect(component.uploadError()).toContain('No se pudo subir');
    expect(component.uploading()).toBeFalse();
    expect(component.categoryForm.value.image).toBe('');
  });

  it('disables submit while an upload is in progress', () => {
    component.categoryForm.patchValue({ name: 'Postres' });
    component.uploading.set(true);
    fixture.detectChanges();

    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button.primary-button'
    );
    expect(submitButton.disabled).toBeTrue();
  });

  it('clears the uploading state and error when reset is triggered', () => {
    component.uploading.set(true);
    component.uploadError.set('boom');

    component.reset = true;
    fixture.detectChanges();

    expect(component.uploading()).toBeFalse();
    expect(component.uploadError()).toBe('');
  });
});
