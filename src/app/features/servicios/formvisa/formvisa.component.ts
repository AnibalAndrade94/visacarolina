import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';

declare var grecaptcha: any;

declare global {
  interface Window {
    captchaResolved: (token: string) => void;
  }
}

type YesNo = boolean | null;

@Component({
  selector: 'app-formvisa',
  templateUrl: './formvisa.component.html',
  styleUrls: ['./formvisa.component.scss']
})
export class FormvisaComponent implements OnInit, AfterViewInit {
  visaForm!: FormGroup;
  originalOrder = () => 0;

  siteKey = '6LeDZuArAAAAAMQIbKtQJ8V60ePbrjz4VTlQP9Oj';
  captchaToken: string = '';
  isSubmitting = false;
submitMsg: string | null = null;
submitOk = false;

  private api = environment.apiBaseUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public analytics: AnalyticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window['captchaResolved'] = (token: string) => {
      this.captchaToken = token;
    };

    // =========================
    // FORM BASE
    // =========================
    this.visaForm = this.fb.group({
      // ====== (A) TU FORM ACTUAL ======
      // Información Personal
      nombre: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      lugarNacimiento: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      curp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccionCasa: ['', Validators.required],
      telefonoCasa: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      telefonoCelular: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],

      // Información de Viaje (legacy; si no lo usas en HTML no estorba)
      numeroPasaporte: [''],
      pasaporteVigencia: [''],
      fechaProbableViaje: [''],
      lugarLlegadaEU: [''],

      // Dirección USA (tu sección en HTML la marca con *)
      direccionUSA: ['', ],
      telefonoUSA: ['', ],
      cpUSA: ['', ],

      nombreHotel: [''],
      direccionHotel: [''],
      visitaFamiliaEmpresa: [''],

      tieneFamiliaEnEU: [''],
      viajesOtrosPaises: [''],
      fechaUltimoViaje: [''],
      haViajadoUSA: [''],
      fechasViaje: [''],

      // Visa
      numeroVisa: [''],
      fechaValidezVisa: [''],
      visaOtorgada: [''],
      visaRevocada: [''],
      huellasTomadas: [''],

      // Viaja acompañado (legacy)
      viajaAcompanado: [''],
      acompanantes: this.fb.array([]),
      personasViajan: [''],

      // Padres
      padresEnUSA: [''],

      // Visa previa (legacy)
      tieneVisa: [''],
      numeroVisaExtra: [''],

      // Redes sociales (tu group actual)
      redesSociales: this.fb.group({
        usaRedes: [false as YesNo], // antes null -> false para no arrancar inválido
        plataforma: [''],
        link: ['']
      }),

      // Información Familiar
      nombrePadre: [''],
      fechaNacimientoPadre: [''],
      nombreMadre: [''],
      fechaNacimientoMadre: [''],
      nombreConyuge: [''],
      lugarNacimientoConyuge: [''],
      fechaNacimientoConyuge: [''],

      // Información Profesional
      estudia: [false],
      trabaja: [false],
      nombreEscuela: [{ value: '', disabled: true }],
      direccionEscuela: [{ value: '', disabled: true }],
      nombreEmpresa: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      sueldo: [{ value: '', disabled: true }],
      descripcionPuesto: [{ value: '', disabled: true }],

      // Dirección actual (legacy)
      direccionActual: [''],
      cpActual: [''],

      // ====== (B) CAMPOS DS-160 EXTRA ======

      // Application meta (si ya no lo usas en HTML, no estorbas)

      // Personal
      ds160_apellidos: [''],
      ds160_nombres: [''],
      ds160_fullNameNative: [''],

      // IMPORTANT: defaults en false para que no arranque inválido
      ds160_hasOtherNames: [false as YesNo,],
      ds160_otherNames: this.fb.array([]), // {apellidos, nombres}

      ds160_birthCity: [''],
      ds160_birthState: [''],
      ds160_birthCountry: ['Mexico'],

      ds160_nationality: ['Mexico', Validators.required],

      ds160_hasOtherNationalities: [false as YesNo,],
      ds160_otherNationalities: this.fb.array([]), // {country, explain}

      ds160_permResidentOtherCountry: [false as YesNo, ],
      ds160_permResidentCountry: [''],

      ds160_usSSN: [''],
      ds160_usTaxId: [''],

      // Travel
      ds160_visaCategory: ['B1/B2', Validators.required],
      ds160_purposeOfTrip: ['',],
      ds160_purposeDetail: [''],

      ds160_hasSpecificPlans: [false as YesNo, ],
      ds160_arrivalDate: [''],
      ds160_departureDate: [''],
      ds160_arrivalCity: [''],
      ds160_usStayAddress: [''],
      ds160_intendedArrivalDate: [''],
      ds160_intendedLengthOfStay: [''],
      ds160_lengthUnit: ['DAYS'],

      ds160_payingEntity: ['SELF', ], // SELF|OTHER_PERSON|COMPANY|OTHER
      ds160_payerPerson: this.fb.group({
        fullName: [''],
        relationship: [''],
        phone: [''],
        email: [''],
        address: ['']
      }),
      ds160_payerCompany: this.fb.group({
        companyName: [''],
        relationship: [''],
        phone: [''],
        email: [''],
        address: ['']
      }),

      // Previous U.S. Travel
      ds160_beenToUS: [false as YesNo, ],
      ds160_previousTrips: this.fb.array([]), // {arrivalDate, departureDate, durationText}

      ds160_usDriversLicense: [false as YesNo,],
      ds160_dlNumber: [''],
      ds160_dlState: [''],

      ds160_hadUSVisa: [false as YesNo, ],
      ds160_previousVisaNumber: [''],
      ds160_previousVisaIssueDate: [''],

      ds160_visaRefused: [false as YesNo,],
      ds160_visaRefusedExplain: [''],

      ds160_visaRevoked: [false as YesNo,],
      ds160_visaRevokedExplain: [''],

      ds160_immigrantPetition: [false as YesNo,],
      ds160_immigrantPetitionExplain: [''],

      // Address / Mailing
      ds160_mailingSameAsHome: [true],
      ds160_mailingAddress: this.fb.group({
        line1: [''],
        line2: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: ['']
      }),

      // Social media DS-160
      ds160_socialProfiles: this.fb.array([]), // {platform, handle, url}
      ds160_otherWebsites: this.fb.array([]), // {url}

      // Passport DS-160
      ds160_passportBookNumber: [''],
      ds160_passportIssuedCity: [''],
      ds160_passportIssuedState: [''],
      ds160_passportIssuedCountry: ['Mexico'],
      ds160_passportIssueDate: [''],

      ds160_passportLostOrStolen: [false as YesNo,],
      ds160_passportLostOrStolenExplain: [''],

      // U.S. Point of Contact
      ds160_usContactType: ['PERSON', ], // PERSON|ORGANIZATION
      ds160_usContactNameOrOrg: ['', ],
      ds160_usContactRelationship: ['',],
      ds160_usContactAddress: ['', ],
      ds160_usContactPhone: ['', ],
      ds160_usContactEmail: [''],

      // Family DS-160
      ds160_hasImmediateRelativesInUS: [false as YesNo, ],
      ds160_relativesInUS: this.fb.array([]), // {relationship, fullName, statusInUS, cityState}

      ds160_hasChildren: [false as YesNo, ],
      ds160_children: this.fb.array([]), // {apellidos,nombres,birthDate,birthCity,birthCountry}

      // Work/Education/Training
      ds160_primaryOccupation: ['',],
      ds160_presentEmployer: this.fb.group({
        employerName: [''],
        address: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: [''],
        phone: [''],
        jobTitle: [''],
        monthlySalary: [''],
        duties: [''],
        startDate: ['']
      }),
      ds160_presentSchool: this.fb.group({
        schoolName: [''],
        address: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: [''],
        courseOfStudy: [''],
        startDate: ['']
      }),
      ds160_previousEmployers: this.fb.array([]),
      ds160_previousSchools: this.fb.array([]),
      ds160_languages: this.fb.array([]),
      ds160_countriesVisited5Years: this.fb.array([]),
      ds160_organizations: this.fb.array([]),
      ds160_specializedSkills: [''],

      // Security and Background


      // Consent
      ds160_confirmTruth: [false,],
      ds160_acceptPrivacy: [false,]
    });

    // Mantengo tu lógica de habilitar/deshabilitar estudio/trabajo
    // + lógica DS-160 condicional
    this.setupConditionalValidators();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (document.getElementById('captcha-container')) {
        grecaptcha.render('captcha-container', {
          sitekey: this.siteKey,
          callback: (token: string) => {
            this.captchaToken = token;
          }
        });
      }
    }, 500);
  }

  // =========================
  // GETTERS (TU HTML + NUEVOS)
  // =========================
  get acompanantes(): FormArray {
    return this.visaForm.get('acompanantes') as FormArray;
  }

  // DS-160 arrays
  get dsOtherNames(): FormArray {
    return this.visaForm.get('ds160_otherNames') as FormArray;
  }
  get dsOtherNationalities(): FormArray {
    return this.visaForm.get('ds160_otherNationalities') as FormArray;
  }
  get dsPreviousTrips(): FormArray {
    return this.visaForm.get('ds160_previousTrips') as FormArray;
  }
  get dsSocialProfiles(): FormArray {
    return this.visaForm.get('ds160_socialProfiles') as FormArray;
  }
  get dsOtherWebsites(): FormArray {
    return this.visaForm.get('ds160_otherWebsites') as FormArray;
  }
  get dsRelativesInUS(): FormArray {
    return this.visaForm.get('ds160_relativesInUS') as FormArray;
  }
  get dsChildren(): FormArray {
    return this.visaForm.get('ds160_children') as FormArray;
  }
  get dsPrevEmployers(): FormArray {
    return this.visaForm.get('ds160_previousEmployers') as FormArray;
  }
  get dsPrevSchools(): FormArray {
    return this.visaForm.get('ds160_previousSchools') as FormArray;
  }
  get dsLanguages(): FormArray {
    return this.visaForm.get('ds160_languages') as FormArray;
  }
  get dsCountriesVisited(): FormArray {
    return this.visaForm.get('ds160_countriesVisited5Years') as FormArray;
  }
  get dsOrganizations(): FormArray {
    return this.visaForm.get('ds160_organizations') as FormArray;
  }

  // =========================
  // ADD/REMOVE (TU HTML)
  // =========================
  agregarAcompanante() {
    const acomp = this.fb.group({
      nombre: ['', Validators.required],
      parentesco: ['', Validators.required]
    });
    this.acompanantes.push(acomp);
  }

  eliminarAcompanante(i: number) {
    this.acompanantes.removeAt(i);
  }

  // =========================
  // ADD/REMOVE (DS-160)
  // =========================
  dsAddOtherName() {
    this.dsOtherNames.push(
      this.fb.group({
        apellidos: ['', Validators.required],
        nombres: ['', Validators.required]
      })
    );
  }
  dsRemoveOtherName(i: number) {
    this.dsOtherNames.removeAt(i);
  }

  dsAddOtherNationality() {
    this.dsOtherNationalities.push(
      this.fb.group({
        country: ['', Validators.required],
        explain: ['']
      })
    );
  }
  dsRemoveOtherNationality(i: number) {
    this.dsOtherNationalities.removeAt(i);
  }

  dsAddPreviousTrip() {
    this.dsPreviousTrips.push(
      this.fb.group({
        arrivalDate: ['', Validators.required],
        departureDate: ['', Validators.required],
        durationText: ['']
      })
    );
  }
  dsRemovePreviousTrip(i: number) {
    this.dsPreviousTrips.removeAt(i);
  }

  dsAddSocialProfile() {
    this.dsSocialProfiles.push(
      this.fb.group({
        platform: ['', Validators.required],
        handle: ['', Validators.required],
        url: ['', this.optionalUrlValidator()]
      })
    );
  }
  dsRemoveSocialProfile(i: number) {
    this.dsSocialProfiles.removeAt(i);
  }

  dsAddOtherWebsite() {
    this.dsOtherWebsites.push(
      this.fb.group({
        url: ['', [Validators.required, this.optionalUrlValidator()]]
      })
    );
  }
  dsRemoveOtherWebsite(i: number) {
    this.dsOtherWebsites.removeAt(i);
  }

  dsAddRelativeInUS() {
    this.dsRelativesInUS.push(
      this.fb.group({
        relationship: ['', Validators.required],
        fullName: ['', Validators.required],
        statusInUS: [''],
        cityState: ['']
      })
    );
  }
  dsRemoveRelativeInUS(i: number) {
    this.dsRelativesInUS.removeAt(i);
  }

  dsAddChild() {
    this.dsChildren.push(
      this.fb.group({
        apellidos: ['', Validators.required],
        nombres: ['', Validators.required],
        birthDate: ['', Validators.required],
        birthCity: [''],
        birthCountry: ['']
      })
    );
  }
  dsRemoveChild(i: number) {
    this.dsChildren.removeAt(i);
  }

  dsAddPreviousEmployer() {
    this.dsPrevEmployers.push(
      this.fb.group({
        employerName: ['', Validators.required],
        jobTitle: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        from: ['', Validators.required],
        to: ['', Validators.required],
        duties: ['']
      })
    );
  }
  dsRemovePreviousEmployer(i: number) {
    this.dsPrevEmployers.removeAt(i);
  }

  dsAddPreviousSchool() {
    this.dsPrevSchools.push(
      this.fb.group({
        schoolName: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        from: ['', Validators.required],
        to: ['', Validators.required],
        course: ['']
      })
    );
  }
  dsRemovePreviousSchool(i: number) {
    this.dsPrevSchools.removeAt(i);
  }

  dsAddLanguage() {
    this.dsLanguages.push(this.fb.group({ language: ['', Validators.required] }));
  }
  dsRemoveLanguage(i: number) {
    this.dsLanguages.removeAt(i);
  }

  dsAddCountryVisited() {
    this.dsCountriesVisited.push(this.fb.group({ country: ['', Validators.required] }));
  }
  dsRemoveCountryVisited(i: number) {
    this.dsCountriesVisited.removeAt(i);
  }

  dsAddOrganization() {
    this.dsOrganizations.push(
      this.fb.group({
        name: ['', Validators.required],
        role: ['']
      })
    );
  }
  dsRemoveOrganization(i: number) {
    this.dsOrganizations.removeAt(i);
  }

  // =========================
  // CAPTCHA
  // =========================
  onCaptchaResolved(token: string) {
    this.captchaToken = token;
  }

  // =========================
  // SUBMIT
  // =========================
onSubmit() {
  this.submitMsg = null;
  this.submitOk = false;

  // Evita doble click
  if (this.isSubmitting) return;

  // Marca todo para que salgan errores visibles
  this.visaForm.markAllAsTouched();

  if (!this.captchaToken) {
    this.submitMsg = 'Por favor, completa el reCAPTCHA.';
    return;
  }

  if (this.visaForm.invalid) {
    this.submitMsg = 'Revisa los campos obligatorios antes de enviar.';
    this.scrollToFirstInvalid();
    return;
  }

  this.isSubmitting = true;

  const payload = {
    ...this.visaForm.getRawValue(),
    _meta: { form: 'ds160_extended', submittedAt: new Date().toISOString() }
  };

  this.http
    .post(`${this.api}/api/verify-recaptcha`, { token: this.captchaToken })
    .pipe(
      switchMap(() => this.http.post(`${this.api}/api/form-visa-americana`, payload)),
      finalize(() => (this.isSubmitting = false))
    )
    .subscribe({
      next: (res) => {
        console.log('✅ Formulario enviado', res);

        this.submitOk = true;
        this.submitMsg = '¡Información enviada! Redirigiendo al inicio...';

        this.analytics.logEvent('form_submit', { form: 'visa', status: 'success' });

        this.visaForm.reset();
        this.applySafeDefaultsAfterReset();

        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
        this.captchaToken = '';

        // Redirige a Home (ajusta la ruta si la tuya no es '/')
        setTimeout(() => this.router.navigate(['/']), 1200);
      },
      error: (err) => {
        console.error('❌ Error al enviar', err);

        this.submitOk = false;
        this.submitMsg = 'Hubo un error al enviar. Intenta más tarde.';

        // opcional: resetea captcha si quieres forzar uno nuevo
        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
        this.captchaToken = '';
      }
    });
}

private scrollToFirstInvalid() {
  setTimeout(() => {
    const el = document.querySelector('.ng-invalid[formControlName], .ng-invalid input, .ng-invalid select, .ng-invalid textarea') as HTMLElement | null;
    if (el?.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 0);
}

  private applySafeDefaultsAfterReset(): void {
    // Defaults que evitan que arranque inválido (YesNo -> false)
    const safe: Record<string, any> = {
      ds160_hasOtherNames: false,
      ds160_hasOtherNationalities: false,
      ds160_permResidentOtherCountry: false,
      ds160_hasSpecificPlans: false,
      ds160_beenToUS: false,
      ds160_usDriversLicense: false,
      ds160_hadUSVisa: false,
      ds160_visaRefused: false,
      ds160_visaRevoked: false,
      ds160_immigrantPetition: false,
      ds160_passportLostOrStolen: false,
      ds160_hasImmediateRelativesInUS: false,
      ds160_hasChildren: false,
      ds160_mailingSameAsHome: true,
      redesSociales: { usaRedes: false, plataforma: '', link: '' },
      ds160_usContactType: 'PERSON',
      ds160_lengthUnit: 'DAYS',
      ds160_payingEntity: 'SELF',
      ds160_birthCountry: 'Mexico',
      ds160_nationality: 'Mexico',
      ds160_passportIssuedCountry: 'Mexico',

    };

    this.visaForm.patchValue(safe, { emitEvent: false });

    // Limpia arrays
    this.dsOtherNames.clear();
    this.dsOtherNationalities.clear();
    this.dsPreviousTrips.clear();
    this.dsSocialProfiles.clear();
    this.dsOtherWebsites.clear();
    this.dsRelativesInUS.clear();
    this.dsChildren.clear();
    this.dsPrevEmployers.clear();
    this.dsPrevSchools.clear();
    this.dsLanguages.clear();
    this.dsCountriesVisited.clear();
    this.dsOrganizations.clear();
  }

  // =========================
  // TU LOGICA ESTUDIA/TRABAJA (IGUAL)
  // =========================
  onCheckChange(type: 'estudia' | 'trabaja') {
    const estudia = this.visaForm.get('estudia')?.value;
    const trabaja = this.visaForm.get('trabaja')?.value;

    if (type === 'estudia') {
      if (estudia) {
        this.visaForm.get('nombreEscuela')?.enable();
        this.visaForm.get('direccionEscuela')?.enable();
      } else {
        this.visaForm.get('nombreEscuela')?.disable();
        this.visaForm.get('direccionEscuela')?.disable();
        this.visaForm.get('nombreEscuela')?.reset();
        this.visaForm.get('direccionEscuela')?.reset();
      }
    }

    if (type === 'trabaja') {
      if (trabaja) {
        this.visaForm.get('nombreEmpresa')?.enable();
        this.visaForm.get('puesto')?.enable();
        this.visaForm.get('sueldo')?.enable();
        this.visaForm.get('descripcionPuesto')?.enable();
      } else {
        this.visaForm.get('nombreEmpresa')?.disable();
        this.visaForm.get('puesto')?.disable();
        this.visaForm.get('sueldo')?.disable();
        this.visaForm.get('descripcionPuesto')?.disable();
        this.visaForm.get('nombreEmpresa')?.reset();
        this.visaForm.get('puesto')?.reset();
        this.visaForm.get('sueldo')?.reset();
        this.visaForm.get('descripcionPuesto')?.reset();
      }
    }
  }

  // =========================
  // VALIDACION CONDICIONAL DS-160
  // =========================
  private setupConditionalValidators() {
    const bind = (path: string, fn: (v: any) => void) => {
      const c = this.visaForm.get(path);
      if (!c) return;
      c.valueChanges.subscribe(fn);
      fn(c.value);
    };

    // Otros nombres -> array
    bind('ds160_hasOtherNames', (v: YesNo) => {
      if (v === true && this.dsOtherNames.length === 0) this.dsAddOtherName();
      if (v !== true) this.dsOtherNames.clear();
    });

    // Otras nacionalidades -> array
    bind('ds160_hasOtherNationalities', (v: YesNo) => {
      if (v === true && this.dsOtherNationalities.length === 0) this.dsAddOtherNationality();
      if (v !== true) this.dsOtherNationalities.clear();
    });

    // Residente permanente
    bind('ds160_permResidentOtherCountry', (v: YesNo) => {
      this.setRequired(this.visaForm.get('ds160_permResidentCountry'), v === true);
      if (v !== true) this.visaForm.get('ds160_permResidentCountry')?.setValue('', { emitEvent: false });
    });

    // Planes específicos
    bind('ds160_hasSpecificPlans', (v: YesNo) => {
      const specific = [
        'ds160_arrivalDate',
        'ds160_departureDate',
        'ds160_arrivalCity',
        'ds160_usStayAddress'
      ];
      const intended = ['ds160_intendedArrivalDate', 'ds160_intendedLengthOfStay'];

      if (v === true) {
        specific.forEach((p) => this.setRequired(this.visaForm.get(p), true));
        intended.forEach((p) => this.setRequired(this.visaForm.get(p), false));
      } else if (v === false) {
        specific.forEach((p) => this.setRequired(this.visaForm.get(p), false));
        intended.forEach((p) => this.setRequired(this.visaForm.get(p), true));
      } else {
        specific.forEach((p) => this.setRequired(this.visaForm.get(p), false));
        intended.forEach((p) => this.setRequired(this.visaForm.get(p), false));
      }
    });

    // Quién paga
    bind('ds160_payingEntity', (v: string) => {
      const person = this.visaForm.get('ds160_payerPerson') as FormGroup;
      const company = this.visaForm.get('ds160_payerCompany') as FormGroup;

      const personReq = v === 'OTHER_PERSON';
      const companyReq = v === 'COMPANY';

      this.setRequiredGroup(person, personReq, ['fullName', 'relationship', 'phone', 'address']);
      this.setRequiredGroup(company, companyReq, ['companyName', 'relationship', 'phone', 'address']);

      if (!personReq) person.reset({ fullName: '', relationship: '', phone: '', email: '', address: '' }, { emitEvent: false });
      if (!companyReq) company.reset({ companyName: '', relationship: '', phone: '', email: '', address: '' }, { emitEvent: false });
    });

    // Viajes previos a US
    bind('ds160_beenToUS', (v: YesNo) => {
      if (v === true && this.dsPreviousTrips.length === 0) this.dsAddPreviousTrip();
      if (v !== true) this.dsPreviousTrips.clear();
    });

    // Licencia US
    bind('ds160_usDriversLicense', (v: YesNo) => {
      this.setRequired(this.visaForm.get('ds160_dlNumber'), v === true);
      this.setRequired(this.visaForm.get('ds160_dlState'), v === true);
      if (v !== true) {
        this.visaForm.get('ds160_dlNumber')?.setValue('', { emitEvent: false });
        this.visaForm.get('ds160_dlState')?.setValue('', { emitEvent: false });
      }
    });

    // Visa previa
    bind('ds160_hadUSVisa', (v: YesNo) => {
      this.setRequired(this.visaForm.get('ds160_previousVisaNumber'), v === true);
      this.setRequired(this.visaForm.get('ds160_previousVisaIssueDate'), v === true);
      if (v !== true) {
        this.visaForm.get('ds160_previousVisaNumber')?.setValue('', { emitEvent: false });
        this.visaForm.get('ds160_previousVisaIssueDate')?.setValue('', { emitEvent: false });
      }
    });

    // Negada/revocada/petición -> explicación
    bind('ds160_visaRefused', (v: YesNo) => {
      this.setRequired(this.visaForm.get('ds160_visaRefusedExplain'), v === true);
      if (v !== true) this.visaForm.get('ds160_visaRefusedExplain')?.setValue('', { emitEvent: false });
    });

    bind('ds160_visaRevoked', (v: YesNo) => {
      this.setRequired(this.visaForm.get('ds160_visaRevokedExplain'), v === true);
      if (v !== true) this.visaForm.get('ds160_visaRevokedExplain')?.setValue('', { emitEvent: false });
    });

    bind('ds160_immigrantPetition', (v: YesNo) => {
      this.setRequired(this.visaForm.get('ds160_immigrantPetitionExplain'), v === true);
      if (v !== true) this.visaForm.get('ds160_immigrantPetitionExplain')?.setValue('', { emitEvent: false });
    });

    // Mailing address
    bind('ds160_mailingSameAsHome', (v: boolean) => {
      const g = this.visaForm.get('ds160_mailingAddress') as FormGroup;
      const req = v === false;
      this.setRequiredGroup(g, req, ['line1', 'city', 'state', 'postalCode', 'country']);
      if (v === true) g.reset({ line1: '', line2: '', city: '', state: '', postalCode: '', country: '' }, { emitEvent: false });
    });

    // Redes sociales: si usa -> al menos 1 perfil
    bind('redesSociales.usaRedes', (v: YesNo) => {
      if (v === true && this.dsSocialProfiles.length === 0) this.dsAddSocialProfile();
      if (v !== true) this.dsSocialProfiles.clear();
    });

    // Pasaporte perdido/robado -> explicación
    bind('ds160_passportLostOrStolen', (v: YesNo) => {
      this.setRequired(this.visaForm.get('ds160_passportLostOrStolenExplain'), v === true);
      if (v !== true) this.visaForm.get('ds160_passportLostOrStolenExplain')?.setValue('', { emitEvent: false });
    });

    // Familiares inmediatos en US -> array
    bind('ds160_hasImmediateRelativesInUS', (v: YesNo) => {
      if (v === true && this.dsRelativesInUS.length === 0) this.dsAddRelativeInUS();
      if (v !== true) this.dsRelativesInUS.clear();
    });

    // Hijos -> array
    bind('ds160_hasChildren', (v: YesNo) => {
      if (v === true && this.dsChildren.length === 0) this.dsAddChild();
      if (v !== true) this.dsChildren.clear();
    });

    // Work/Edu según ocupación
    bind('ds160_primaryOccupation', (v: string) => {
      const employer = this.visaForm.get('ds160_presentEmployer') as FormGroup;
      const school = this.visaForm.get('ds160_presentSchool') as FormGroup;

      const isEmployed = ['EMPLOYED', 'SELF_EMPLOYED'].includes(v);
      const isStudent = v === 'STUDENT';

      this.setRequiredGroup(employer, isEmployed, ['employerName', 'city', 'country', 'jobTitle', 'startDate']);
      this.setRequiredGroup(school, isStudent, ['schoolName', 'city', 'country', 'courseOfStudy', 'startDate']);

      if (!isEmployed) employer.reset({
        employerName: '', address: '', city: '', state: '', postalCode: '', country: '',
        phone: '', jobTitle: '', monthlySalary: '', duties: '', startDate: ''
      }, { emitEvent: false });

      if (!isStudent) school.reset({
        schoolName: '', address: '', city: '', state: '', postalCode: '', country: '',
        courseOfStudy: '', startDate: ''
      }, { emitEvent: false });
    });

    // Security parts: si cualquiera es Sí -> explain required
    this.bindSecurityExplain('ds160_security_part1');
    this.bindSecurityExplain('ds160_security_part2');
    this.bindSecurityExplain('ds160_security_part3');
    this.bindSecurityExplain('ds160_security_part4');
    this.bindSecurityExplain('ds160_security_part5');
  }

  private bindSecurityExplain(groupPath: string) {
    const grp = this.visaForm.get(groupPath) as FormGroup;
    if (!grp) return;

    const recompute = () => {
      const raw = grp.getRawValue() as Record<string, any>;
      const explain = grp.get('explain');

      if (!explain) return;

      const anyYes = Object.keys(raw)
        .filter((k) => k !== 'explain')
        .some((k) => raw[k] === true);

      this.setRequired(explain, anyYes);

      if (!anyYes) explain.setValue('', { emitEvent: false });
    };

    grp.valueChanges.subscribe(recompute);
    recompute();
  }

  // =========================
  // HELPERS VALIDATORS
  // =========================
  private setRequired(control: AbstractControl | null, required: boolean) {
    if (!control) return;
    control.setValidators(required ? [Validators.required] : []);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private setRequiredGroup(group: FormGroup, required: boolean, keys: string[]) {
    keys.forEach((k) => this.setRequired(group.get(k), required));
  }

  private optionalUrlValidator(): ValidatorFn {
    const urlRegex = /^(https?:\/\/)?([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i;
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '').toString().trim();
      if (!v) return null;
      return urlRegex.test(v) ? null : { url: true };
    };
  }
}
