import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NominaService {

  constructor( private db: AngularFirestore) { }

  cargarNomina() {
    return this.db.collection('nomina').valueChanges({idField: 'id_nomina'});
  }
  cudNomina() {
    return this.db.collection('nomina');
  }
}
