import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor( private db: AngularFirestore ) {
  }

  cargarClientes() {
  return this.db.collection('clientes').valueChanges({idField: 'id_cte'});
}
  cudCtes( ) {
    return this.db.collection('clientes');
  }

}
