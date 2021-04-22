import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserBase } from '../security/model/UserBase';
import { usuarioU } from '../general/model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  newPass = '';
  sameU = false;

  constructor( private db: AngularFirestore, private http: HttpClient) {
  }
  // FB
  cargarUsuarios() {
    return this.db.collection('usuarios').valueChanges({idField: 'id_user'}); 
  }
    
  cudUsuarios() {
      return this.db.collection('usuarios');
  }


  // DB

  crearUsuarioS(usuario: UserBase) {
    return this.http.post<any>(`${environment.gtosUrl}/usuario/crearUsuario`, usuario);
  }
  consultaUsuarios() {
    return this.http.get(`${environment.gtosUrl}/usuario/obtenerTodosUsuarios`);
  }
  actualizar(usuario: usuarioU) {
   this.newPass = usuario.usuario.passNew;
   return this.http.post<any>(`${environment.gtosUrl}/usuario/actualizarPerfilUsuario`, usuario )
  }


}
