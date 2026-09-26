import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SeoService } from '../../services/seo.service';

type VisaStatus = 'NEVER' | 'APPROVED' | 'DENIED';

@Component({
  selector: 'app-visa-eligibility-wizard',
  templateUrl: './visa-eligibility-wizard.component.html',
  styleUrls: ['./visa-eligibility-wizard.component.scss']
})
export class VisaEligibilityWizardComponent implements OnInit{
 step = 0;
   private api = environment.apiBaseUrl;
   resume: boolean = false;
consentAccepted = false;

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
    privacyConsent: [false, Validators.requiredTrue],
  });

  constructor(private fb: FormBuilder,private http: HttpClient,private seo: SeoService) {}
ngOnInit(): void {
     this.seo.update({ title: 'Evalúa tu elegibilidad para la visa | VisaCarolina',
  description: 'Responde unas preguntas y descubre cómo prepararte mejor para tu trámite de visa.',
  path: '/evaluacion' });
 
}
  // --- Helpers ---
  get visaStatus() {
    return this.form.controls.visaStatus.value as VisaStatus;
  }

  next(): void {
  if (!this.canGoNext()) return;

  this.applyStepSideEffects();
  this.resume = false;

  if (this.step < this.steps.length - 1) this.step++;

  if (this.step !== 6) {
    this.consentAccepted = false;
  }
}

  prev(): void {
  if (this.step > 0) this.step--;
  this.resume = false;

  if (this.step < 6) {
    this.consentAccepted = false;
  }
}
  private clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}


toggleResume(): void {
  this.resume = !this.resume;
}

get scoreResult() {
  const v = this.form.getRawValue();

  let score = 100;
  const reasons: string[] = [];

  // Banderas rojas
  if (v.illegalStayOrWork) { score -= 50; reasons.push('Antecedente de estancia/trabajo irregular.'); }
  if (v.deported) { score -= 60; reasons.push('Antecedente de deportación.'); }
  if (v.seriousLegalIssues) { score -= 40; reasons.push('Problemas legales relevantes.'); }

  // Historial visa
  if (v.visaStatus === 'DENIED') {
    const year = v.visaDeniedYear ?? 0;
    const current = new Date().getFullYear();
    const yearsAgo = year ? (current - year) : 0;

    if (!year) { score -= 20; reasons.push('Visa negada sin año indicado.'); }
    else if (yearsAgo <= 5) { score -= 25; reasons.push('Negativa reciente (≤ 5 años).'); }
    else { score -= 15; reasons.push('Negativa antigua (> 5 años).'); }
  }

  // Viajes
  if (!v.traveledLast5Years) { score -= 10; reasons.push('Sin viajes internacionales recientes.'); }
  else { score += 10; }

  // Arraigo: propiedades / dependientes
  if (v.hasProperties) score += 10;
  if (v.hasDependents) score += 8;

  // ✅ Arraigo: ocupación (usa valores reales del select)
  switch (v.occupation) {
    case 'sin_empleo':
      score -= 25;
      reasons.push('Actualmente sin empleo.');
      break;
    case 'estudiante':
      score -= 10;
      reasons.push('Perfil estudiante (se evalúa con más detalle el arraigo).');
      break;
    case 'negocio':
      score += 8;
      break;
    case 'empleado':
      score += 10;
      break;
  }

  // ✅ Arraigo: ingresos (usa valores reales del select)
  switch (v.incomeRange) {
    case '<10k':
      score -= 15;
      reasons.push('Ingreso mensual bajo (según lo declarado).');
      break;
    case '10-20k':
      score -= 5;
      break;
    case '20-35k':
      score += 5;
      break;
    case '+35k':
      score += 10;
      break;
  }

  // ✅ Tiempo en empleo (solo si no está "sin empleo")
  if (v.occupation !== 'sin_empleo') {
    switch (v.employmentTime) {
      case '<6m':
        score -= 15;
        reasons.push('Menos de 6 meses en el empleo.');
        break;
      case '6-12m':
        score -= 5;
        break;
      case '1-3y':
        score += 8;
        break;
      case '+3y':
        score += 12;
        break;
    }
  }

  score = this.clamp(score);

  let label: 'BAJO' | 'MEDIO' | 'ALTO' = 'MEDIO';
  if (score >= 80) label = 'BAJO';
  else if (score <= 54) label = 'ALTO';

  return { score, label, reasons };
}


  goTo(stepIndex: number): void {
    // opcional: permitir saltos solo hacia atrás
    if (stepIndex <= this.step) this.step = stepIndex;
  }
  get salesMessage() {
  const { label } = this.scoreResult;

  if (label === 'BAJO') {
    return {
      title: 'Buen perfil para iniciar tu trámite',
      body: `
        Con base en tus respuestas, tu perfil muestra buen arraigo y pocos factores de riesgo.
        <br><br>
        Esto no garantiza la aprobación, pero sí te coloca en una posición favorable
        si tu trámite se hace correctamente.
        <br><br>
        Muchos perfiles “buenos” fallan por errores evitables en el formulario
        o en la entrevista. Nuestro trabajo es ayudarte a no cometerlos.
      `
    };
  }

  if (label === 'MEDIO') {
    return {
      title: 'Tu perfil es viable, pero requiere estrategia',
      body: `
        Tu perfil puede avanzar, pero hay puntos que deben manejarse con cuidado.
        <br><br>
        En este tipo de casos, la diferencia entre aprobación o negativa
        suele estar en los detalles.
        <br><br>
        Antes de enviar cualquier formulario, es clave revisar tu información
        y preparar correctamente tu entrevista.
      `
    };
  }

  return {
    title: 'Tu perfil necesita una revisión antes de continuar',
    body: `
      Hay factores que podrían complicar tu trámite si se inicia sin una estrategia adecuada.
      <br><br>
      Esto no significa que sea imposible, pero hacerlo sin asesoría
      aumenta el riesgo de una negativa y puede afectar futuros intentos.
      <br><br>
      Lo más importante aquí es analizar tu caso y definir el mejor momento para aplicar.
    `
  };
}
get whatsappHref(): string {
  const name = this.value.fullName || '';
  const msg = `Hola, quiero una asesoría para mi evaluación de visa. Mi nombre es ${name}`;
  return `https://wa.me/524448017241?text=${encodeURIComponent(msg)}`;
}
acceptPrivacyAndShowResult(): void {
  const control = this.form.controls.privacyConsent;
  control.markAsTouched();

  if (control.invalid) return;

  this.consentAccepted = true;
}

 submit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload = {
    ...this.form.getRawValue(),
    score: this.scoreResult.score,
    risk: this.scoreResult.label,
    scoreReasons: this.scoreResult.reasons,
  };

  this.http.post(`${this.api}/api/evaluacion-visa`, payload)
    .subscribe({
      next: () => alert('Enviado ✅'),
      error: (err) => {
  console.error('Error completo:', err);
  console.error('Status:', err.status);
  console.error('Body:', err.error);
  alert(err?.error?.message || 'Error al enviar ❌');
}
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
