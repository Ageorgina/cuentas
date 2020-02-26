import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
@Component({
  selector: 'app-inv-usuarios',
  templateUrl: './inv-usuarios.component.html',
  styleUrls: ['./inv-usuarios.component.css']
})
export class InvUsuariosComponent implements OnInit {
  titulo = 'Usuarios ASG';
  headTitle = ['Nombre', 'Puesto', 'Modificar / Eliminar'];
  elements = [];

  constructor(private _user: UsuariosService) { }

  ngOnInit() {
    this._user.cargarUsuarios().subscribe( usuarios => { 
      this.elements = usuarios;
    }
      );
  }
  borrar( ) {
    this._user.deleteUsuarios('1');
    console.log('se elimino');
  }

  actualizar() {
    console.log('se actualizo');
  }

  }

