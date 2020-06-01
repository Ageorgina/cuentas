import { Component, OnInit } from '@angular/core';
import { Reembolso } from 'src/app/general/model/reembolso';
import { GastosService } from '../../../services/gastos.service';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { Gasto } from '../../../general/model/gasto';
import { Usuario } from '../../../general/model/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ProyectosService } from '../../../services/proyectos.service';

@Component({
  selector: 'app-inv-reembolso',
  templateUrl: './inv-reembolso.component.html',
  styleUrls: ['./inv-reembolso.component.css']
})
export class InvReembolsoComponent implements OnInit {

  titulo = 'Reembolsos';
  headTitle = ['Solicitante', 'Fecha', 'Monto', 'Motivo', 'Estatus', 'Comprobantes', 'Modificar / Eliminar'];
  elements: Reembolso[] = [];
  loading = true;
  comprobantes: any[] = [];
  sameU: boolean;
  admin: string;
  rolU: string;
  tesorero: string;
  usuarioLocal: any;
  usuarioActual: any;
  // tslint:disable-next-line: variable-name
  constructor( private _gstS: GastosService, private router: Router, private alert: AlertasService, private _user: UsuariosService) {

                this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                this._gstS.cargarReembolsos().subscribe((reembolsos: Reembolso[]) => {
                  reembolsos.filter(registro => {
                  this._user.cargarUsuarios().subscribe( (usuarios: Usuario[]) => {
                    usuarios.filter(usuario => {
                      if (this.usuarioLocal['usuario'].username === usuario.correo) {
                        this.usuarioActual = usuario;
                      }
                      this.sameU = usuario.correo === this.usuarioLocal['usuario'].username;
                      if (this.sameU) {
                            if (usuario.rol !== 'Usuario') {
                                if (registro.estatus === 'Solicitar' && this.usuarioActual['rol'] === 'Aprobador') {
                                  this.elements.push(registro);
                                  registro.arrComprobantes = registro.comprobantes.split(',');
                                  this.loading = false;
                                }
                                if (registro.estatus === 'Aprobado' && this.usuarioActual['rol'] === 'Tesorero') {
                                  this.elements.push(registro);
                                  registro.arrComprobantes = registro.comprobantes.split(',');
                                  this.loading = false;
                                }
                            } else {
                                this.loading = false;
                                if ( usuario.correo === registro.solicitante) {
                                this.elements.push(registro);
                                registro.arrComprobantes = registro.comprobantes.split(',');
                                }
                                }
                              }
                      });
                    });
                  });
                });
              }

  ngOnInit() {


  }
  borrar( value ) {
    console.log(value)
    this._gstS.cudReembolsos().doc(value.id_reembolso).delete();
    this.alert.showSuccess();
    this.router.navigate(['registro-reembolso']);
    this.loading = false;
  }

  actualizar(value) {
    this.router.navigate(['registro-reembolso', `${value.id_reembolso}`]);
  }

}
