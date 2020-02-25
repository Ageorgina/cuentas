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
    return this.db.collection('clientes').valueChanges();
}
  addClientes() {
    return this.db.collection('clientes').valueChanges();  }
  updateClientes() {
    return this.db.collection('clientes').valueChanges();  }
  deleteClientes() {
    return this.db.collection('clientes').valueChanges();
    }

}
