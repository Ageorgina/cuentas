import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  
  constructor( private db: AngularFirestore ) {
  }
   
   cargarUsuarios() {
    return this.db.collection('usuarios').valueChanges();
  }
  addUsuarios() {
    return this.db.collection('usuarios');
  }

  updateUSuarios(order: any) {
   // return this.usuariosCollection.doc(order.id).update(order);
  }
  deleteUsuarios(id: string) {
    //console.log( " ->",this.usuarios);
    //console.log(this.usuariosCollection.doc(id));
    //return this.usuariosCollection.doc(id).delete();
  }
}
