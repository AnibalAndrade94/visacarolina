import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type VisaStatus = 'NEVER' | 'APPROVED' | 'DENIED';

@Component({
  selector: 'app-visa-eligibility-wizard',
  templateUrl: './visa-eligibility-wizard.component.html',
  styleUrls: ['./visa-eligibility-wizard.component.scss']
})
export class VisaEligibilityWizardComponent {
 step = 0;

  steps = [
    'Datos personales',
    'Historial de visa',
    'Viajes internacionales',
    'Arraigo laboral y económico',
    'Motivo del viaje',
    'Alertas',
    'Resumen',
  ] as const;

  form = this.fb.group({
    // 1) Datos personales
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    whatsapp: ['', [Validators.required, Validators.minLength(10)]],
    age: [null as number | null, [Validators.required, Validators.min(1), Validators.max(120)]],
    civilStatus: ['', [Validators.required]],

    // 2) Historial visa
    visaStatus: ['NEVER' as VisaStatus, [Validators.required]],
    visaExpiredYear: [null as number | null],
    visaDeniedYear: [null as number | null],

    // 3) Viajes
    traveledLast5Years: [false, [Validators.required]],
    countriesVisited: [''],
    travelFrequency: [''],

    // 4) Arraigo
    occupation: ['', [Validators.required]],
    employmentTime: ['', [Validators.required]],
    incomeRange: ['', [Validators.required]],
    hasProperties: [false, [Validators.required]],
    hasDependents: [false, [Validators.required]],

    // 5) Motivo
    tripPurpose: ['', [Validators.required]],
    stayDuration: ['', [Validators.required]],
    hasFamilyInUS: [false, [Validators.required]],
    familyInUSDetails: [''],

    // 6) Alertas
    illegalStayOrWork: [false, [Validators.required]],
    deported: [false, [Validators.required]],
    seriousLegalIssues: [false, [Validators.required]],

    // Extras
    extraComments: [''],
  });

  constructor(private fb: FormBuilder,private http: HttpClient) {}

  // --- Helpers ---
  get visaStatus() {
    return this.form.controls.visaStatus.value as VisaStatus;
  }

  next(): void {
    if (!this.canGoNext()) return;

    this.applyStepSideEffects();

    if (this.step < this.steps.length - 1) this.step++;
  }

  prev(): void {
    if (this.step > 0) this.step--;
  }

  goTo(stepIndex: number): void {
    // opcional: permitir saltos solo hacia atrás
    if (stepIndex <= this.step) this.step = stepIndex;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Aquí solo frontend: por ahora imprime el payload
    this.http.post('https://visaback-production-3ac4.up.railway.app/api/evaluacion-visa', this.form.getRawValue())
  .subscribe({
    next: () => alert('Enviado ✅'),
    error: (e) => alert('Error al enviar ❌')
  });
  }

  // --- Validación por step ---
  private canGoNext(): boolean {
    const controls = this.getControlsForStep(this.step);
    controls.forEach((c) => c.markAsTouched());

    // Valida controles visibles + reglas condicionales
    if (controls.some((c) => c.invalid)) return false;

    // Reglas condicionales:
    if (this.step === 1) {
      const status = this.visaStatus;
      if (status === 'APPROVED') {
        const y = this.form.controls.visaExpiredYear.value;
        if (!this.isValidYear(y)) {
          this.form.controls.visaExpiredYear.setErrors({ year: true });
          return false;
        }
      }
      if (status === 'DENIED') {
        const y = this.form.controls.visaDeniedYear.value;
        if (!this.isValidYear(y)) {
          this.form.controls.visaDeniedYear.setErrors({ year: true });
          return false;
        }
      }
    }

    if (this.step === 2) {
      const traveled = this.form.controls.traveledLast5Years.value;
      if (traveled) {
        const countries = this.form.controls.countriesVisited.value?.trim();
        const freq = this.form.controls.travelFrequency.value?.trim();
        if (!countries) {
          this.form.controls.countriesVisited.setErrors({ required: true });
          return false;
        }
        if (!freq) {
          this.form.controls.travelFrequency.setErrors({ required: true });
          return false;
        }
      }
    }

    if (this.step === 4) {
      const hasFamily = this.form.controls.hasFamilyInUS.value;
      if (hasFamily) {
        const details = this.form.controls.familyInUSDetails.value?.trim();
        if (!details) {
          this.form.controls.familyInUSDetails.setErrors({ required: true });
          return false;
        }
      }
    }

    return true;
  }

  private getControlsForStep(step: number) {
    const c = this.form.controls;
    switch (step) {
      case 0:
        return [c.fullName, c.email, c.whatsapp, c.age, c.civilStatus];
      case 1:
        return [c.visaStatus]; // años se validan condicionalmente
      case 2:
        return [c.traveledLast5Years]; // countries/frequency condicional
      case 3:
        return [c.occupation, c.employmentTime, c.incomeRange, c.hasProperties, c.hasDependents];
      case 4:
        return [c.tripPurpose, c.stayDuration, c.hasFamilyInUS]; // details condicional
      case 5:
        return [c.illegalStayOrWork, c.deported, c.seriousLegalIssues];
      case 6:
        return []; // resumen
      default:
        return [];
    }
  }

  private applyStepSideEffects(): void {
    // Limpia campos que ya no aplican
    if (this.step === 1) {
      const status = this.visaStatus;
      if (status !== 'APPROVED') this.form.controls.visaExpiredYear.setValue(null);
      if (status !== 'DENIED') this.form.controls.visaDeniedYear.setValue(null);
    }

    if (this.step === 2) {
      const traveled = this.form.controls.traveledLast5Years.value;
      if (!traveled) {
        this.form.controls.countriesVisited.setValue('');
        this.form.controls.travelFrequency.setValue('');
      }
    }

    if (this.step === 4) {
      const hasFamily = this.form.controls.hasFamilyInUS.value;
      if (!hasFamily) this.form.controls.familyInUSDetails.setValue('');
    }
  }

  private isValidYear(y: number | null): boolean {
    if (!y) return false;
    const year = Number(y);
    const current = new Date().getFullYear();
    return year >= 1980 && year <= current + 5;
  }

  // Barra de progreso simple
  get progressPct(): number {
    const total = this.steps.length - 1; // no contar resumen como "paso de preguntas" si no quieres
    return Math.round((Math.min(this.step, total) / total) * 100);
  }

  // Para el resumen
  get value() {
    return this.form.getRawValue();
  }
}
