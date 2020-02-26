import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor( private db: AngularFirestore ) {
  }

    cargarGastos() {
      return this.db.collection('gastos-generales').valueChanges();
    }
    cudGastos() {
      return this.db.collection('gastos-generales');
    }

  // OFICINA
      cargarGastosOF() {
        return this.db.collection('oficina ').valueChanges();
      }
      cudGastosOF() {
        return this.db.collection('oficina ');
      }

  }
