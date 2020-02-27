import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Cliente } from '../general/model/cliente';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  clientes = [];
  constructor( private db: AngularFirestore ) {
  }

  cargarClientes() {
  this.db.collection('clientes').valueChanges().subscribe(clientes => {
    this.clientes = clientes;
  });
  return this.db.collection('clientes').valueChanges({idField: 'id_cte'});
}
  cudCtes( ) {
    return this.db.collection('clientes');
  }

}
