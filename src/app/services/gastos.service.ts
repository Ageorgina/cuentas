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
    addGastos() {
      return this.db.collection('gastos-generales').valueChanges();  }
    updateGastos() {
      return this.db.collection('gastos-generales').valueChanges();  }
    deleteGastos() {
      return this.db.collection('gastos-generales').valueChanges();
      }
  // OFICINA
      cargarGastosOF() {
        this.db.collection('oficina ').valueChanges().subscribe(gastos => console.log(gastos));
        return this.db.collection('oficina ').valueChanges();
      }
      addGastosOF() {
        return this.db.collection('oficina ').valueChanges();  }
      updateGastosOF() {
        return this.db.collection('oficina ').valueChanges();  }
      deleteGastosOF() {
        return this.db.collection('oficina ').valueChanges();
        }
  }
