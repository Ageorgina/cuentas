import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';







@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor( private db: AngularFirestore ) {
  }

  cargarClientes() {
    return this.db.collectionGroup('clientes').valueChanges();
}
  addClientes() {
    return this.db.collectionGroup('clientes').valueChanges();  }
  updateClientes() {
    return this.db.collectionGroup('clientes').valueChanges();  }
  deleteClientes() {
    return this.db.collectionGroup('clientes').valueChanges();
    }

}
