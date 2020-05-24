import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor( private db: AngularFirestore ) {
  }

    cargarGastos() {
      return this.db.collection('gastos-generales').valueChanges({idField: 'id_gasto'});
    }
    cudGastos() {
      return this.db.collection('gastos-generales');
    }
    cargarTipoGtos() {
      return this.db.collection('tipo_gto').valueChanges({idFile: 'id_tipo_gto'});
    }
    cargarReembolsos() {
      return this.db.collection('reembolsos').valueChanges({idField: 'id_reembolso'});
    }
    cudReembolsos() {
      return this.db.collection('reembolsos');
    }


  }
