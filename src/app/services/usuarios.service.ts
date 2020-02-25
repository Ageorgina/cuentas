import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor( private db: AngularFirestore ) {

   }

   borrar(){
    console.log('db', this.db.collection);
   }
}
