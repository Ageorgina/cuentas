import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor( private db: AngularFirestore ) {
  }

  cargarAreas() {
  return this.db.collection('areas').valueChanges({idField: 'id_area'});
}
cudAreas() {
  return this.db.collection('areas');
}

}
