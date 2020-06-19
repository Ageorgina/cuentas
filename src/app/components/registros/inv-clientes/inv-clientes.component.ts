import { Component, OnInit } from '@angular/core';
import { Cliente, Usuario } from '../../../general/model';
import { Router } from '@angular/router';
import { AlertasService, UsuariosService, ClientesService  } from '../../../services';

@Component({
  selector: 'app-inv-clientes',
  templateUrl: './inv-clientes.component.html',
  styleUrls: ['./inv-clientes.component.css']
})
export class InvClientesComponent implements OnInit {
  titulo = 'Clientes';
  headTitle = ['Nombre', 'Puesto', 'Empresa', 'Celular', 'Modificar'];
  elements: Cliente[] = [];
  loading = true;
  usuarioLocal: any;
  admin: boolean;
  sameU: boolean;
  usuarios: Usuario[];
  // tslint:disable-next-line: variable-name
  constructor( private _cteS: ClientesService, private router: Router, private alert: AlertasService, private _user: UsuariosService) {
                this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                  this._cteS.cargarClientes().subscribe( (clientes: Cliente[]) => {
                    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                      this.usuarios = usuarios;
                      usuarios.filter( usuario => {
                        if ( usuario.correo === this.usuarioLocal['usuario'].username) {
                          if (usuario['rol'] === 'Administrador') { this.admin = true; } 
                      }
                    }); });
                    this.elements = clientes;
                    this.loading = false;
                  });
                 }

  ngOnInit() {
    this.loading = false;
  }
  borrar( value ) {
    this.loading = true;
    this._cteS.cudCtes().doc(value.id_cte).delete();
    this.alert.showSuccess();
    this.loading = false;
  }

  actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-clientes', `${value.id_cte}`]);
  }

}
