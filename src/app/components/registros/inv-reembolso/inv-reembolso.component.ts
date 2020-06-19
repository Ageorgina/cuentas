import { Component } from '@angular/core';
import { Reembolso } from '../../../general/model';
import { Router } from '@angular/router';
import { GastosService, AlertasService, UsuariosService, DescargasService } from '../../../services';

@Component({
  selector: 'app-inv-reembolso',
  templateUrl: './inv-reembolso.component.html',
  styleUrls: ['./inv-reembolso.component.css']
})
export class InvReembolsoComponent {

  titulo = 'Reembolsos';

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
  file: {} = {};
  // tslint:disable-next-line: variable-name
  constructor( private _gstS: GastosService, private router: Router, private _user: UsuariosService,
               private alert: AlertasService, private descargas: DescargasService) {
                 this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                 this._user.cargarUsuarios().subscribe(usuarios => {
                  usuarios.filter( usuario => {
                  if (this.usuarioLocal.usuario.username === usuario['correo'] ) {
                    this.usuarioActual = usuario;
                    this._gstS.cargarReembolsos().subscribe((reembolsos: Reembolso[]) => {
                      reembolsos.filter( reembolso => {
                        this.loading = false;
                        if (this.usuarioActual.rol !== 'Usuario') {
                          if ( this.usuarioActual['rol'] === 'Aprobador') {
                            if (reembolso.estatus === 'Solicitar') {
                              this.elements.push(reembolso);
                              reembolso['arrComprobantes'] = reembolso['comprobantes'].split(',');
                            }
                          } else {
                              if (reembolso.estatus === 'Aprobado' || (reembolso.solicitante === this.usuarioActual.correo)) {
                                this.elements.push(reembolso);
                                reembolso['arrComprobantes'] = reembolso['comprobantes'].split(',');
                              }
                          }
                        } else {
                          if ( reembolso.solicitante === this.usuarioActual.correo ) {
                            this.elements.push(reembolso);
                            reembolso['arrComprobantes'] = reembolso['comprobantes'].split(',');
                          }
                        }

                  });
                });
              }
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
