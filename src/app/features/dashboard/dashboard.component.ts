import { Component, inject } from '@angular/core';
import { TestFirebaseService } from '../../core/services/test-firebase.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private testService = inject(TestFirebaseService);
  testResult = '';

  async testFirebase() {
    this.testResult = 'Probando.....';

    const writeOk = await this.testService.testWrite();
    const readOk = await this.testService.testRead();

    if (writeOk && readOk) {
      this.testResult = '✅ Firebase funciona correctamente!';
    } else {
      this.testResult = '❌ Error en Firebase. Revisa la consola.';
    }
  }
}
