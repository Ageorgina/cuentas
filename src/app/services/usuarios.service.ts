import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

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
    return this.db.collection('usuarios').valueChanges();  }
  updateUsuarios() {
    return this.db.collection('usuarios').valueChanges();  }
  deleteUsuarios() {
    return this.db.collection('usuarios').valueChanges();
    }
  }
