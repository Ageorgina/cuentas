import { Component, OnInit } from '@angular/core';
import { Gasto, Usuario } from '../../../general/model';
import { Router } from '@angular/router';
import { AlertasService, DescargasService, UsuariosService, GastosService } from '../../../services';

@Component({
  selector: 'app-inv-gastos-generales',
  templateUrl: './inv-gastos-generales.component.html',
  styleUrls: ['./inv-gastos-generales.component.css']
})
export class InvGastosGeneralesComponent implements OnInit {
  titulo = 'Gastos Generales';
  headTitle = ['Solicitante', 'Fecha', 'Monto', 'Motivo', 'Tipo', 'Proyecto', 'Estatus', 'Comprobantes', 'Modificar'];
  elements: Gasto[] = [];
  loading = true;
  usuarioLocal: any;
  usuarioActual: any;
  sameU: boolean;
  aprobador: boolean;
  financiero: boolean;
  tesorero: boolean;

  // tslint:disable-next-line: variable-name
  constructor( private _gstS: GastosService, private _user: UsuariosService, private router: Router,
               private alert: AlertasService, private descargas: DescargasService ) {

    this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
    this._gstS.cargarGastos().subscribe((gastos: Gasto[]) => {
                this._user.cargarUsuarios().subscribe( (usuarios: Usuario[]) => {
                  usuarios.filter(usuario => {
                    this.sameU = usuario.correo === this.usuarioLocal['usuario'].username;
                    if (this.usuarioLocal['usuario'].username === usuario.correo) {
                      this.usuarioActual = usuario;
                    }
                    gastos.filter(registro => {
                      if (this.sameU) {
                        if ( (this.usuarioActual.correo === registro.solicitante) || registro.estatus === 'Aprobado' )  {
                          if (this.usuarioActual.rol === 'Tesorero' ||  this.usuarioActual.rol === 'Financiero') {
                            this.loading = false;
                            this.elements.push(registro);
                            registro.arrComprobantes = registro.comprobantes.split(',');
                          }
                          }
                        if (this.usuarioActual.rol === 'Administrador')  {
                          this.loading = false;
                          this.elements.push(registro);
                          registro.arrComprobantes = registro.comprobantes.split(',');
                        }
                      } else {
                        this.loading = false;
                      }
                });
                    });
                  });
                });
                }

  ngOnInit() {

    this.loading = false;
  }
  borrar( value ) {
    this.loading = true;
    this._gstS.cudGastos().doc(value.id_gasto).delete();
    this.alert.showSuccess();
    this.loading = false;
  }

  actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-gastos', `${value.id_gasto}`]);
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
