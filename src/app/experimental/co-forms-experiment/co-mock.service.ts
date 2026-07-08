import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Medication, MetadataField } from './clinical-order-form.types';

@Injectable({
  providedIn: 'root'
})
export class COMockService {
  getMedications(): Observable<Medication[]> {
    return of([
      {
        medicationName: 'Aspirin',
        dosage: '100 mg'
      },
      {
        medicationName: 'Ibuprofen',
        dosage: '200 mg'
      },
      {
        medicationName: 'Metformin',
        dosage: '500 mg'
      }
    ]);
  }

  getMetadataFields(): Observable<MetadataField[]> {
    return of([
      {
        key: 'department',
        value: 'Cardiology'
      },
      {
        key: 'hospital',
        value: 'Central Clinic'
      },
      {
        key: 'ward',
        value: 'ICU'
      }
    ]);
  }
}
