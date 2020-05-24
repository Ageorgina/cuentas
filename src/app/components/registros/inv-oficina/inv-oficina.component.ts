import { Component, OnInit } from '@angular/core';
import { OficinaService } from '../../../services/oficina.service';
import { Oficina, Partida } from '../../../general/model/oficina';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-inv-oficina',
  templateUrl: './inv-oficina.component.html',
  styleUrls: ['./inv-oficina.component.css']
})
export class InvOficinaComponent implements OnInit {
  titulo = 'Oficina';
  headTitle = ['Responsable ASG', 'Fecha', 'Partida', 'Monto', 'Motivo', 'Modificar / Eliminar'];
  elements = [];
  saldoDisp = 0;
  ingresos: any;
  egresos: any;
  ingresoT = 0;
  egresoT  = 0;
  loading = true;
  partida: Partida;
  textError = 'Error con el servidor, intentelo mas tarde';
  usuarioLocal: any;
  nuevaP= true;
  partidaActual = {};
  id_partidafb: string;
  modificada : {};
  par = {};
  id_partida: Date;
  // tslint:disable-next-line: variable-name
  constructor( private gstS: OficinaService,
               private  router: Router,
               private alert: AlertasService) {
                this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                this.gstS.cargarPartidas().subscribe( partidas => {
                  this.nuevaP = false;
                  if (partidas.length === 0) {
                    this.nuevaP = true;
                    this.loading = false;
                    return ;
                  }
                  this.par = partidas;
                  partidas.filter(dato => {
                    this.nuevaP = false;
                    if (dato['sobrante'] > 0) {
                      this.partidaActual = dato;
                      console.log(this.partidaActual)
                      this.id_partida = this.partidaActual['id_partida'];
                      this.gstS.cargarGastosOF().subscribe( gastos => {
                        if (gastos.length === 0 ) {
                          this.saldoDisp = this.partidaActual['sobrante'];
                        } else {
                          gastos.filter( gasto => {
                            console.log('gasto[id_partida]',gasto['id_partida'])
                            console.log('this.partidaActual[id_partida]', this.partidaActual['id_partida'])
                            console.log('entro 56', gasto['id_partida'] === this.partidaActual['id_partida']);
                            if (gasto['id_partida'] === this.partidaActual['id_partida']) {
                              console.log('entro');
                              this.elements.push(gasto);
                              this.egresoT  += Number(gasto['cantidad']);
                              this.saldo().finally(() => {
                                this.egresoT = 0;
                              });
                            }  else {
                              this.nuevaP = true;
                              this.loading = false;
                            }
                          });
                        }

                      }, error => {
                        console.log('error gastos', error);
                      }

                      );
                    }
      });
    }, error => {
      console.log('error partidas', error);
    }
    );



               }
  ngOnInit() {
    this.loading = false;
  }
  async saldo() {
    this.saldoDisp =  this.partidaActual['cantidad'] - this.egresoT;
    return this.saldoDisp;
  }

  borrar( value ) {
    this.egresoT = 0;
    this.partidaActual['sobrante'] = (this.partidaActual['sobrante'] + Number(value['cantidad']));
    this.gstS.cudPartida().doc(this.partidaActual['id_partidafb']).update(this.partidaActual).finally(()=> {
      this.gstS.cudGastosOF().doc(value.id_of).delete();
      this.alert.showSuccess();
    });
    this.loading = false;
  }

  actualizar(value) {
    this.loading = true;
    this.router.navigate(['registro-oficina', `${value.id_of}`]);
  }

  entroError() {
    this.alert.textError = this.textError;
    this.alert.showError();
    this.loading = false;
  }

}
