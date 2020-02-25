import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  constructor( private db: AngularFirestore ) {

  }
  cargarProyectos() {
   return this.db.collection('proyectos').valueChanges();
 }
 cudProyectos() {
   return this.db.collection('proyectos');
  }

  }
