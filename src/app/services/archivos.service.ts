
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { FileItem } from '../general/model';
import { AlertasService } from './srv_shared/alertas.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  CARPETA_FILES = 'comprobantes';
  id: any;
  storageRef = firebase.storage().ref();

  constructor(private db: AngularFirestore, public alerta: AlertasService, private http: HttpClient ) { }

 async cargarArchivosFb(archivos: FileItem[]) {
   console.log(archivos)
    for ( const item of archivos ) {
      item.estaSubiendo = true;
      if ( item.completo === true ) {
        item.estaSubiendo = false;
        continue ;
      }

      const uploadTask: firebase.storage.UploadTask = this.storageRef.child(`${ this.CARPETA_FILES}/${item.id}`)
      .put( item.archivo );

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
                   ( snapshot: firebase.storage.UploadTaskSnapshot ) =>
                   item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
                   ( error ) => {
                    this.alerta.textError = error.message;
                    this.alerta.showError();
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
  }

}
