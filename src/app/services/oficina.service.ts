import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  constructor( private db: AngularFirestore ) {
  }
  // GASTOS
  cargarGastosOF() {
    return this.db.collection('oficina').valueChanges({idField: 'id_of'});
  }
  cudGastosOF() {
    return this.db.collection('oficina');
  }
  // PARTIDA

  cargarPartidas() {
    return this.db.collection('partidas').valueChanges({idField: 'id_partidafb'});
  }
  cudPartida() {
    return this.db.collection('partidas');
  }
}

