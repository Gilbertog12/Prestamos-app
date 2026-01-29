import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePrestamosComponent } from './reporte-prestamos.component';

describe('ReportePrestamosComponent', () => {
  let component: ReportePrestamosComponent;
  let fixture: ComponentFixture<ReportePrestamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportePrestamosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportePrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
