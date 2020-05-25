import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../security/store/reducers/app.reducers';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { UserBase } from '../security/model/UserBase';
import { AlertasService } from '../services/srv_shared/alertas.service';
import { usuarioU } from '../general/model/usuario';
import { catchError } from 'rxjs/operators';
import {map} from 'rxjs/operators';
import { DesactivarLoadingAction } from '../security/store/actions';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  newPass = '';

  constructor( private db: AngularFirestore, private http: HttpClient, private store: Store<AppState>, private alert: AlertasService  ) {
  }

   cargarUsuarios() {
    return this.db.collection('usuarios').valueChanges({idField: 'id_user'});
  }
  cudUsuarios() {
    return this.db.collection('usuarios');
  }
  crearUsuarioS(usuario: UserBase) {
    return this.http.post<any>(`${environment.gtosUrl}/usuario/crearUsuario`, usuario);
  }
  consultaUsuarios() {
    return this.http.get(`${environment.gtosUrl}/usuario/obtenerTodosUsuarios`);
  }
  actualizar(usuario: usuarioU) {
    return this.http.post<any>(`${environment.gtosUrl}/usuario/actualizarPerfilUsuario`, usuario );
  }
  regresa(exito) {
    this.newPass = exito;
    return this.newPass;
  }
}
