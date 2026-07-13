import { FormArray, FormControl, FormGroup, FormRecord } from '@angular/forms';

export interface OrderDetailsForm {
  orderName: FormControl<string | null>;
  physician: FormControl<string | null>;
  priority: FormControl<string | null>;
}

export interface PatientCriteriaForm {
  patientAge: FormControl<number | null>;
  patientGender: FormControl<string | null>;
}

export interface SchedulingForm {
  startDate: FormControl<string | null>;
  endDate: FormControl<string | null>;
  frequency: FormControl<string | null>;
}

export interface AlertsForm {
  notifyPhysician: FormControl<boolean | null>;
  criticalResultAlert: FormControl<boolean | null>;
}

export interface MedicationForm {
  medicationName: FormControl<string | null>;
  dosage: FormControl<string | null>;
}

export interface DiagnosisForm {
  diagnosisCode: FormControl<string | null>;
  diagnosisDescription: FormControl<string | null>;
}

export interface LabForm {
  testName: FormControl<string | null>;
  testCode: FormControl<string | null>;
}

export interface ClinicalOrderForm {
  orderDetails: FormGroup<OrderDetailsForm>;
  patientCriteria: FormGroup<PatientCriteriaForm>;
  scheduling: FormGroup<SchedulingForm>;

  alerts: FormGroup<AlertsForm>;

  medications: FormArray<FormGroup<MedicationForm>>;
  diagnoses: FormArray<FormGroup<DiagnosisForm>>;
  labs: FormArray<FormGroup<LabForm>>;

  metadata: FormRecord<FormControl<string | null>>;
  customFields: FormRecord<FormControl<string | null>>;
}

export interface Medication {
  medicationName: string;
  dosage: string;
}

export interface MetadataField {
  key: string;
  value: string;
}
