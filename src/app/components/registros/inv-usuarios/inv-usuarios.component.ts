import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-inv-usuarios',
  templateUrl: './inv-usuarios.component.html',
  styleUrls: ['./inv-usuarios.component.css']
})
export class InvUsuariosComponent implements OnInit {
  titulo = ' Usuarios ASG';
  headTitle = ['Nombre', 'Puesto', 'Modificar / Eliminar'];
  elements = [];

  constructor(private _userS: UsuariosService) { }

  ngOnInit() {
    this._userS.cargarUsuarios().subscribe( usuarios => { 
      this.elements = usuarios;
    }
      );
  }

  }

