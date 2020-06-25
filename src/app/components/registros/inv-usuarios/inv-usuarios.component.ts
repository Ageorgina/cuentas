import { Component, OnInit } from '@angular/core';
import { Usuario, usuarioU } from '../../../general/model';
import { Router } from '@angular/router';
import { AlertasService, UsuariosService } from '../../../services';
@Component({
  selector: 'app-inv-usuarios',
  templateUrl: './inv-usuarios.component.html',
  styleUrls: ['./inv-usuarios.component.css']
})

export class InvUsuariosComponent implements OnInit {
  titulo = 'Usuarios ASG';
  headTitle = ['Nombre', 'Rol', 'Área', 'Jefe Inmediato', 'Correo', 'Puesto','Modificar'];
  elements: Usuario[];
  usuario = Usuario;
  loading = true;
  usuariosConsultas: any[];
  usuarioLocal: any;
  userU: usuarioU;
  valido: string;
  activo: boolean;
  sameU: boolean;
  admin: string;
  rolU: string;
  tesorero: string;

  // tslint:disable-next-line: variable-name
  constructor( private _user: UsuariosService, private router: Router) {
                this.loading = false;
                this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                this._user.cargarUsuarios().subscribe( (usuarios: Usuario[]) => {
                  usuarios.filter(usuario => {
                    this.sameU = usuario.correo === this.usuarioLocal['usuario'].username;
                    if (this.sameU) {
                      this.elements = [];
                    if (usuario.rol === 'Usuario') {
                      this.rolU = usuario.rol;
                      this.elements.push(usuario);
                      } else {
                         if (usuario.rol === 'Administrador') {
                          this.admin = usuario.rol;
                          this.elements = usuarios;
                          return;
                         } else if ( usuario.rol === 'Financiero') {
                          this.elements.push(usuario);
                         } else {
                          this.tesorero = usuario.rol;
                          this.elements = usuarios;
                          return;
                         }

                      }
                    }
                  });
                  this.loading = false;
                });
              }

ngOnInit() {
  }


borrar( value ) {
  value['activo'] = false;
  this._user.cudUsuarios().doc(value['id_user']).update(value);
  this.loading = false;
  }

actualizar(value) {
    this.router.navigate(['registro-usuarios', `${value.id_user}`]);
  }

  }

