import { Component, OnInit } from '@angular/core';
import { Partida } from '../../../general/model';
import { Router } from '@angular/router';
import { AlertasService, DescargasService, OficinaService  } from '../../../services';

@Component({
  selector: 'app-inv-oficina',
  templateUrl: './inv-oficina.component.html',
  styleUrls: ['./inv-oficina.component.css']
})
export class InvOficinaComponent implements OnInit {
  titulo = 'Oficina';
  headTitle = ['Responsable ASG', 'Fecha', 'Partida', 'Monto', 'Motivo', 'Comprobantes', 'Acciones'];
  elements = [];
  saldoDisp = 0;
  submitted = false;
  loading = true;
  partida: Partida;
  textError = 'Error con el servidor, intentelo más tarde';
  usuarioLocal: any;
  partidaActual = {};
  modificada: {};
  par = [];
  // tslint:disable-next-line:variable-name
  id_partida: any;
  constructor( private alert: AlertasService, private router: Router, private gstS: OficinaService, private descargas: DescargasService) {
      this.loading = true;
      this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
      this.gstS.cargarPartidas().subscribe( partidas => {
        if (partidas.length === 0 && this.partidaActual === undefined) {
          this.loading = false;
          return ;
        }
        this.submitted = false;
        this.par = partidas;
        this.partidaUnica();
        this.loading = false;
        this.id_partida = this.partidaActual['id_partida'];
        this.saldoDisp = Number(this.partidaActual['sobrante']);
     this.gstS.cargarGastosOF().subscribe( gastos => {
        if (gastos.length === 0) {
          this.loading = false;
          return ;
     }  this.submitted = false;
        gastos.filter( gasto => {
        if(gasto['id_partidafb'] === this.partidaActual['id_partidafb']){
          this.elements.push(gasto)
          this.saldoDisp = this.partidaActual['sobrante'];
          this.elements.filter(registro => {
            registro.arrComprobantes = registro.comprobantes.split(',');
          });
     }
   })
 });
     });
    }

      ngOnInit() {
        this.loading = false;
  }


    borrar( value ) {
    this.partidaActual['sobrante'] = (this.partidaActual['sobrante'] + Number(value['cantidad']));
    this.gstS.cudPartida().doc(this.partidaActual['id_partidafb']).update(this.partidaActual).finally(() => {
    this.gstS.cudGastosOF().doc(value.id_of).delete();
    this.alert.showSuccess();
    this.router.navigate(['/registro-oficina']);
    });
    this.loading = false;
  }

      actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-oficina', `${value.id_of}`]);
  }

      entroError() {
    this.loading = false;
    this.alert.textError = this.textError;
    this.alert.showError();
    this.submitted = false;
    return;
  }
      exitoso() {
    this.loading = false;
    this.alert.showSuccess();
    this.submitted = false;
    return;
  }

      regresar() {
    this.router.navigate(['oficina']);
}
partidaUnica() {
  this.par.filter( dato => {
      if (dato.sobrante === 0) {
        return;
      } else {
        this.partidaActual = dato;
        return  ;
      }
  });
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
