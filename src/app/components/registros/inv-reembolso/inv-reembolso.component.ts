import { Component } from '@angular/core';
import { Reembolso } from 'src/app/general/model/reembolso';
import { GastosService } from '../../../services/gastos.service';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { Usuario } from '../../../general/model/usuario';
import { UsuariosService, DescargasService } from '../../../services';

@Component({
  selector: 'app-inv-reembolso',
  templateUrl: './inv-reembolso.component.html',
  styleUrls: ['./inv-reembolso.component.css']
})
export class InvReembolsoComponent {

  titulo = 'Reembolsos';
  headTitle = ['Solicitante', 'Fecha', 'Monto', 'Motivo', 'Estatus', 'Comprobantes', 'Modificar'];
  elements: Reembolso[] = [];
  loading = true;
  comprobantes: any[] = [];
  sameU: boolean;
  admin: string;
  rolU: string;
  tesorero: string;
  usuarioLocal: any;
  usuarioActual: any;
  tipo: string;
  reembolso: string;
  file: {} = {};
  xls = 'https://firebasestorage.googleapis.com/v0/b/gastos-asg.appspot.com/o/comprobantes%2Fxls.png?alt=media&token=8528e3ba-6337-47c5-afca-f52d977e57dc';
  pdf = 'https://firebasestorage.googleapis.com/v0/b/gastos-asg.appspot.com/o/comprobantes%2Fpdf.png?alt=media&token=7f276f27-85b8-411b-8609-ce86d8169b9c';
  sinImg = 'https://firebasestorage.googleapis.com/v0/b/gastos-asg.appspot.com/o/comprobantes%2Ffile.png?alt=media&token=35c80e34-6321-4f7b-919a-c577f48a1622';
  // tslint:disable-next-line: variable-name
  constructor( private _gstS: GastosService, private router: Router, private alert: AlertasService, 
               private _user: UsuariosService, private descargas: DescargasService) {
    this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
    this._gstS.cargarReembolsos().subscribe((reembolsos: Reembolso[]) => {
                  reembolsos.filter(registro => {
                  this._user.cargarUsuarios().subscribe( (usuarios: Usuario[]) => {
                    usuarios.filter(usuario => {
                      if (this.usuarioLocal['usuario'].username === usuario.correo) {
                        this.usuarioActual = usuario;
                      }
                      this.sameU = (usuario.correo === this.usuarioLocal['usuario'].username);
                      if (this.sameU) {
                            if (usuario.rol !== 'Usuario') {
                              if(this.usuarioActual['rol'] === 'Administrador' || ( registro.estatus === 'Solicitar')) {
                                this.elements.push(registro);
                                this.loading = false;
                                registro.arrComprobantes = registro.comprobantes.split(',');
                              }
                                if (registro.estatus === 'Solicitar' && this.usuarioActual['rol'] === 'Aprobador') {
                                  this.elements.push(registro);
                                  registro.arrComprobantes = registro.comprobantes.split(',');
                                  this.loading = false;
                                }
                                if ( this.usuarioActual['rol'] === 'Tesorero' || this.usuarioActual['rol'] === 'Financiero') {
                                  if ( registro.estatus === 'Aprobado' ){

                                    this.elements.push(registro);
                                    this.loading = false;
                                    registro.arrComprobantes = registro.comprobantes.split(',');

                                  }

                                }
                            }
                              }
                      });
                    });
                  });
                });
              }

  borrar( value ) {
    this._gstS.cudReembolsos().doc(value.id_reembolso).delete();
    this.alert.showSuccess();
    this.router.navigate(['registro-reembolso']);
    this.loading = false;
  }

  actualizar(value) {
    this.router.navigate(['registro-reembolso', `${value.id_reembolso}`]);
  }

  verMas(event) {
    this.file = event;
  }

  limpiar(event) {
    event = '';
  }

  descargar( file ) {
    const fecha = Date.now();
    this.descargas.descargar(file).subscribe(data => {
      const dataP = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = dataP;
      if (data.type === 'application/vnd.ms-excel') {
      a.download = String(fecha) + '.xls';
    } else if (data.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      a.download = String(fecha) + '.xlsx';
    } else {
      a.download = String(fecha);
    }
      document.body.appendChild(a);
      this.loading = false;
      a.click();
      this.alert.showSuccess();
  },
  error => {
      this.loading = false;
      this.alert.showError();
  });
  }
}
