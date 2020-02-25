import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor( private db: AngularFirestore ) { 
  }
    cargarGastos() {
      return this.db.collectionGroup('gastos-generales').valueChanges();
    }
    addGastos() {
      return this.db.collectionGroup('gastos-generales').valueChanges();  }
    updateGastos() {
      return this.db.collectionGroup('gastos-generales').valueChanges();  }
    deleteGastos() {
      return this.db.collectionGroup('gastos-generales').valueChanges();
      }
  
  }
