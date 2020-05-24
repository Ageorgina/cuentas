import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OficinaService } from '../../../services/oficina.service';
import { Oficina, Partida } from '../../../general/model/oficina';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { Utils } from '../../../general/utils/utils';
import Swal from 'sweetalert2';
import { GastosService } from '../../../services/gastos.service';

@Component({
  selector: 'app-registro-oficina',
  templateUrl: './registro-oficina.component.html',
  styleUrls: ['./registro-oficina.component.css']
})
export class RegistroOficinaComponent implements OnInit {
  loading = false;
  partidaForm: FormGroup;
  submitted = false;
  titulo = 'Registrar Gastos Oficina';
  actualizar = false;
  boton = 'Guardar';
  cambiar = false;
  textError = '';
  partida: Partida;
  ofForm: FormGroup;
  usuarioLocal: any;
  partidaActual: Partida;
  pFecha: any;
  gst = [];
  par = [];
  gasto: Oficina;
  // tslint:disable-next-line:variable-name
  id_partida: any;
  saldoDisp = 0;
  gastos = [];
  usuario: string;
  modificado: any;

  constructor( private formBuilder: FormBuilder, private alert: AlertasService,
               private router: Router, private gstS: OficinaService,
               private utils: Utils ) {
                 this.loading = true;
                 this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                 this.gstS.cargarPartidas().subscribe( partidas => {
                  this.submitted = false;
                  this.par = partidas;
                  this.partidaUnica();
                   if (partidas.length === 0 || this.partidaActual === undefined) {
                     this.cambiar = false;
                     this.loading = false;
                     return ;
                }
                   this.cambiar = true;
                   this.loading = false;
                   this.id_partida = this.partidaActual.id_partida;
                   this.saldoDisp = Number(this.partidaActual.sobrante);
                   this.gstS.cargarGastosOF().subscribe( gastos => {
                   if (gastos.length === 0) {
                     this.cambiar = true;
                     this.loading = false;
                     return ;
                }                  this.submitted = false;  
                this.gastos = gastos;
                   this.gastos.filter( gasto => {
                   if(gasto['id_partida'] != this.id_partida){
                   this.saldoDisp = this.partidaActual['sobrante'];
                }
              });
            });
                 /*  this.saldoDisp = this.partidaActual['sobrante'];
                   this.id_gasto = gasto['id_of'];
                   if (gasto['id_partida'] === this.partidaActual['id_partida']) {
                   this.egresoT += Number(gasto['cantidad']);
                   this.saldo().finally(() => {
                   this.egresoT = 0;
                });
                } else {
                   // this.nuevaP = true;
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
                   console.log('error partidas', error);*/
                });


                // FORMULARIOS
                 this.partidaForm = this.formBuilder.group({
                   fecha: ['', Validators.required],
                   cantidad: ['', Validators.required],
                  });
                 this.ofForm = this.formBuilder.group({
                    resp_asg: [''],
                  fecha: ['', Validators.required],
                  cantidad: ['', Validators.required],
                  motivo: ['', Validators.required],
                  id_partida: ['']
                });
  }
  ngOnInit() {

  }
get fval() { return this.ofForm.controls; }
get f() { return this.partidaForm.controls; }

  partidaSubmit() {
    this.cambiar = false;
    this.submitted = true;
    this.loading = true;
    this.partida = this.partidaForm.value;
    this.pVacia();
    if (this.partidaForm.invalid) {
      this.textError = '¡Faltan campos por llenar!';
      this.entroError();
      return ;
    }
    if (this.pFecha === this.partida.fecha ) {
      this.loading = false;
      this.textError = '¡Ya existe una partida con esa fecha!, Asignar una fecha diferente';
      this.entroError();
      return ;
    }
    /****PENDIENTE VALIDAR PORQUE ERRORES COSA UNICO */
    if (this.pFecha !== this.partida.fecha  && this.par.length >= 1 ) {
      this.submitted = false;
        this.partida.id_partida = this.partida.fecha;
        this.partida.sobrante = this.partida.cantidad;
        this.partida.devolver = false;
        this.partida.devuelto = 0;
        this.gstS.cudPartida().add(this.partida);
        this.exitoso();
        this.cambiar = true;
        this.limpiar();
        return;
      }
    this.cambiar = true;
    }
    onSubmit() {
      this.submitted = true;
      this.loading = true;
      this.gasto = this.ofForm.value;
      this.gVacio();
      if (this.ofForm.invalid) {
        this.submitted = false;
        this.textError = '¡Faltan campos por llenar!';
        this.entroError();
        return ;
      }

      if (this.saldoDisp < this.gasto.cantidad ) {
        this.submitted = false;
        this.textError = 'No cuentas con el saldo suficiente para registrar este gasto';
        this.entroError();
        }
      if ( this.gastos.length >= 1) {
        this.submitted = false;
          console.log('entro aqui 161');
          this.usuario = this.usuarioLocal.usuario.username;
          this.gasto.id_partida = this.partidaActual.id_partida;
          this.gasto.resp_asg = this.usuario;
          this.gasto.id_partidafb = this.partidaActual.id_partidafb;
          this.partidaActual.sobrante = this.saldoDisp - this.gasto.cantidad;
          this.gstS.cudGastosOF().add(this.gasto);
          this.gstS.cudPartida().doc(this.partidaActual.id_partidafb).update(this.partidaActual);
          this.exitoso();
          this.limpiar();
        }

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
    limpiar() {
      this.loading = false;
      this.ofForm.reset();
      this.submitted = false;
    }
    regresar() {
      this.router.navigate(['oficina']);
  }
  checkNumerosP($event: KeyboardEvent) {
    this.utils.numerosp($event);
    }
    checkCaracteres($event: KeyboardEvent) {
    this.utils.letrasCaracteres($event);
    }


    pVacia() {
      if ( this.par.length === 0 ) {
        this.partida.id_partida = this.partida.fecha;
        this.partida.sobrante = this.partida.cantidad;
        this.partida.devolver = false;
        this.partida.devuelto = 0;
        this.gstS.cudPartida().add(this.partida);
        this.exitoso();
        this.cambiar = true;
        return;
      }  else {
        this.par.filter( dato => {
          if (dato['id_partida'] === this.partida.fecha) {
            this.pFecha = dato['id_partida'];
            return;
          }
          return ;
      });
    }
  }

    gVacio() {
      if ( this.gastos.length === 0 ) {
        this.usuario = this.usuarioLocal.usuario.username;
        this.gasto.id_partida = this.partidaActual.id_partida;
        this.gasto.resp_asg = this.usuario;
        this.gasto.id_partidafb = this.partidaActual.id_partidafb;
        this.partidaActual.sobrante = this.saldoDisp - this.gasto.cantidad;
        this.gstS.cudGastosOF().add(this.gasto);
        this.gstS.cudPartida().doc(this.partidaActual.id_partidafb).update(this.partidaActual);
        this.exitoso();
        this.limpiar();
        return;
      }  else {
        console.log('entra a else 229');
        return;
    }
  }
  partidaUnica() {
      this.par.filter( dato => {
       if (dato.sobrante === 0 ) {
        return;
      } else {
        this.cambiar = true;
        this.partidaActual = dato;
        return  ;
      }
    });
    }
    devolver() {
      this.modificado = this.partidaActual;
      this.modificado.devolver = true;
      this.modificado.devuelto = this.saldoDisp;
      this.modificado.sobrante = 0;
      Swal.fire({
      title: 'Estas seguro de realizar esta operacion',
      text: "No podras modificarla despues",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4E936F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
      }).then((result) => {
      if (result.value) {
      this.gstS.cudPartida().doc(this.partidaActual.id_partidafb).update(this.modificado);
      this.regresar();
      Swal.fire(
      'Exitoso',
      'success'
      );
      }
      });
  }
}

