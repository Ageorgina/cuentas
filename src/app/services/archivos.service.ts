
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../general/model/file-item';
import { AlertasService } from './srv_shared/alertas.service';
import { async } from '@angular/core/testing';


@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  CARPETA_FILES = 'comprobantes';

  constructor(private db: AngularFirestore, public alerta: AlertasService ) { }

 async cargarArchivosFb(archivos: FileItem[]) {
    const storageRef = firebase.storage().ref();
    for ( const item of archivos ) {
      item.estaSubiendo = true;
      if ( item.completo === true ) {
        item.estaSubiendo = false;
        continue ;
      }

      const uploadTask: firebase.storage.UploadTask = storageRef.child(`${ this.CARPETA_FILES}/${ item.archivo.lastModified }`)
      .put( item.archivo );

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
                   ( snapshot: firebase.storage.UploadTaskSnapshot ) =>
                   item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
                   ( error ) => {
                    this.alerta.textError = error.message;
                    this.alerta.showError();
                 //  console.error( 'Error al subir', error );
                  }, () => {
                    uploadTask.snapshot.ref.getDownloadURL().then( downloadURL => {
                      item.url = downloadURL;
                      item.estaSubiendo = false;
                      item.completo = true;
                      this.guardarArchivos({
                          nombre: item.nombreArchivo,
                          url: item.url
                        });
                    });
                  });
                   }
      }

  private guardarArchivos( file: { nombre: string, url: string } ) {

    return ;
    // this.db.collection( `/${ this.CARPETA_FILES }` )
    // .add( file );
  }
}
