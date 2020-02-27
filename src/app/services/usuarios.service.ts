import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor( private db: AngularFirestore ) {
  }

   cargarUsuarios() {
    return this.db.collection('usuarios').valueChanges({idField: 'id_user'});
  }

  cudUsuarios() {
    return this.db.collection('usuarios');
  }

  }
