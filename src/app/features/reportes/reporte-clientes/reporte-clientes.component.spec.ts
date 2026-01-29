import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteClientesComponent } from './reporte-clientes.component';

describe('ReporteClientesComponent', () => {
  let component: ReporteClientesComponent;
  let fixture: ComponentFixture<ReporteClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
