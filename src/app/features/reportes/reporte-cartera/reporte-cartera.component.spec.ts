import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCarteraComponent } from './reporte-cartera.component';

describe('ReporteCarteraComponent', () => {
  let component: ReporteCarteraComponent;
  let fixture: ComponentFixture<ReporteCarteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCarteraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
