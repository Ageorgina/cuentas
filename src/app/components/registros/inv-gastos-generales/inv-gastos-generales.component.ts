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
                this._user.cargarUsuarios().subscribe(usuarios => {
                 usuarios.filter( usuario => {
                 if (this.usuarioLocal.usuario.username === usuario['correo'] ) {
                   this.usuarioActual = usuario;
                   this._gstS.cargarGastos().subscribe((gastos: Gasto[]) => {
                     gastos.filter( gasto => {
                       this.loading = false;
                       if (this.usuarioActual.rol !== 'Aprobador') {
                        if (this.usuarioActual.correo === gasto.solicitante || gasto.reembolso === true) {
                         if (gasto.reembolso === true) {
                          this.elements.push(gasto);
                          gasto['arrComprobantes'] = gasto['comprobantes'].split(',');
                         }
                        }
                      } else {
                         if ( gasto.solicitante === this.usuarioActual.correo ) {
                           this.elements.push(gasto);
                           gasto['arrComprobantes'] = gasto['comprobantes'].split(',');
                       }
                      }
                 });
               });
             }
           });
          });
        }

  ngOnInit() {
    this.loading = false;
  }
  borrar( value ) {
    this.loading = true;
    this.loading = true;this._gstS.cudGastos().doc(value.id_gasto).delete().finally(() => {
    this.alert.showSuccess();
    this.loading = false;
    this.router.navigate(['registro-gastos']);
    });
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
