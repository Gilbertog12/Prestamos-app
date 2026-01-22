import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPrestamoComponent } from './formulario-prestamo.component';

describe('FormularioPrestamoComponent', () => {
  let component: FormularioPrestamoComponent;
  let fixture: ComponentFixture<FormularioPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPrestamoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
