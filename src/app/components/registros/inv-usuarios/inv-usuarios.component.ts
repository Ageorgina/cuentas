import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../general/model/usuario';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inv-usuarios',
  templateUrl: './inv-usuarios.component.html',
  styleUrls: ['./inv-usuarios.component.css']
})
export class InvUsuariosComponent implements OnInit {
  titulo = 'Usuarios ASG';
  headTitle = ['Nombre', 'Puesto', 'Modificar / Eliminar'];
  elements: Usuario[] = [];
  usuario = Usuario;

  // tslint:disable-next-line: variable-name
  constructor(private _user: UsuariosService, private router: Router) { }

  ngOnInit() {
    this._user.cargarUsuarios().subscribe( (usuarios: Usuario[]) => {
      this.elements = usuarios;
    }
      );
  }
  borrar( value ) {
    this._user.cudUsuarios().doc(value.id_user).delete();
  }

  actualizar(value) {
    this.router.navigate(['registro-usuarios', `${value.id_user}`]);
  }

  }

