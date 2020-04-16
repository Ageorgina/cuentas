import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../general/model/usuario';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
@Component({
  selector: 'app-inv-usuarios',
  templateUrl: './inv-usuarios.component.html',
  styleUrls: ['./inv-usuarios.component.css']
})
export class InvUsuariosComponent implements OnInit {
  titulo = 'Usuarios ASG';
  headTitle = ['Nombre', 'Área', 'Jefe Inmediato', 'Correo', 'Puesto', 'Modificar / Eliminar'];
  elements: Usuario[] = [];
  usuario = Usuario;
  loading = true;

  // tslint:disable-next-line: variable-name
  constructor( private _user: UsuariosService,
               private router: Router,
               private alert: AlertasService) {
                this._user.cargarUsuarios().subscribe( (usuarios: Usuario[]) => {
                  this.elements = usuarios;
                  this.loading = false;
                });
                }

  ngOnInit() {

  }
  borrar( value ) {
    this.loading = true;
    this._user.cudUsuarios().doc(value.id_user).delete();
    this.alert.showSuccess();
    this.loading = false;
  }

  actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-usuarios', `${value.id_user}`]);
  }

  }

