import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario, usuarioU } from '../../../general/model/usuario';
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
  usuariosConsultas: any[];
  usuarioLocal: any;
  userU: usuarioU;
  valido: string;
  activo: boolean;

  // tslint:disable-next-line: variable-name
  constructor( private _user: UsuariosService,
               private router: Router,
               private alert: AlertasService) {
                this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                this._user.cargarUsuarios().subscribe( (usuarios: Usuario[]) => {
                  this.elements = usuarios;
                  this.elements.filter( usuario => {
                    if (usuario.activo === true){

                    }
                  })
                  this.loading = false;
                });
                this._user.consultaUsuarios().subscribe( usuarios => {
                  this.usuariosConsultas = usuarios['resultado'].usuarios;
                });
              }

ngOnInit() {
  console.log('usuario', this.usuarioLocal);
  }


borrar( value ) {
  this.usuariosConsultas.filter(usuario => {
    if (this.valido ['username'] === this.valido['correo']) {
      this.valido['activo'] = false;
      this._user.cudUsuarios().doc(this.valido['id_user']).update(this.valido);
    }
  });
  this.loading = false;
  }

actualizar(value) {
    this.router.navigate(['registro-usuarios', `${value.id_user}`]);
  }

  }

