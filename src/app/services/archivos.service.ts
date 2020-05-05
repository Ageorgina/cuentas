
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../general/model/file-item';


@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  CARPETA_FILES = 'comprobantes';
  fileUrl: string;
  filesUrl: any[] = [];
  urlFiles: string[] = [];

  constructor(private db: AngularFirestore) { }

  cargarArchivosFb(archivos: FileItem[]) {
    const storageRef = firebase.storage().ref();
    for ( const item of archivos ) {
      item.estaSubiendo = true;
      if ( item.progreso >= 100 ) {
        continue ;
      }
      const uploadTask: firebase.storage.UploadTask = storageRef.child(`${ this.CARPETA_FILES}/${ item.nombreArchivo }`)
      .put( item.archivo );

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
                   ( snapshot: firebase.storage.UploadTaskSnapshot ) =>
                   item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
                   ( error ) => console.error( 'Error al subir', error ),
                   () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(( downloadURL ) => {
                    item.url = downloadURL;
                    item.estaSubiendo = false;
                    this.guardarArchivos({
                      nombre: item.nombreArchivo,
                      url: item.url});
                    });
                   }
      );
    }
  }

  private guardarArchivos( file: { nombre: string, url: string } ) {
    // this.db.collection( `/${ this.CARPETA_FILES }` )
    // .add( file );
  }
}
