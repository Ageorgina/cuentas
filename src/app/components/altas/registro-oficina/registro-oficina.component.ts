import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OficinaService } from '../../../services/oficina.service';
import { Oficina, Partida } from '../../../general/model/oficina';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { Utils } from '../../../general/utils/utils';
import Swal from 'sweetalert2';
import { FileItem } from '../../../general/model/file-item';
import { ArchivosService } from '../../../services/archivos.service';

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
  id_of: string;
  gastoU: any;
  nameFile: string;
  ruta = 'gs://gastos-asg.appspot.com/comprobantes/';
  estaSobreElemento = false;
  archivos: FileItem[] = [];
  comprobantes: any;
  file: FileItem;
  headTitle = ['Nombre', 'Progreso'];
  comprobante: string;
  arrayUrl: string[] = [];

  constructor( private formBuilder: FormBuilder, private alert: AlertasService,
               private router: Router, private gstS: OficinaService,
               private utils: Utils, private active: ActivatedRoute,
               private _fileS: ArchivosService ) {
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
                  id_partida: [''],
                  comprobantes: ['']
                });
                this.id_of = this.active.snapshot.paramMap.get('id_of');
                if (this.id_of) {
                  this.loading = false;
                  this.titulo = 'Modificar Gasto';
                  this.actualizar = true;
                  this.gstS.cargarGastosOF().subscribe((upGasto) => {
                    upGasto.filter( gasto => {
                      if(this.id_of === gasto.id_of){
                    this.gastoU = gasto;
                    this.ofForm.get(['fecha']).setValue(this.gastoU['fecha']);
                    this.ofForm.get(['cantidad']).setValue(this.gastoU['cantidad']);
                    this.ofForm.get(['motivo']).setValue(this.gastoU['motivo']);
                    this.ofForm.get(['comprobantes']).setValue(this.gastoU.comprobantes);
                      }
                });    
            });
          }

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
      this.alert.formInvalid();
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

      this.arrayUrl = [];
      this.archivos.filter( data => {
        if (data.url !== 'NO TIENE URL') {
          this.arrayUrl.push(data.url);
        }
      });
      if (this.archivos.length === 0) {
        this.comprobantes = '';
      } else {
        this.comprobantes = this.arrayUrl.join(',');
      }
      this.ofForm.value.comprobantes = this.comprobantes;
      this.gVacio();
      if (this.ofForm.invalid) {
        this.submitted = false;
        this.loading = false;
        this.alert.formInvalid();
        return ;
      }

      if (this.saldoDisp < this.gasto.cantidad ) {
        this.submitted = false;
        this.textError = 'No cuentas con el saldo suficiente para registrar este gasto';
        this.entroError();
        }
        
      if (!this.id_of && this.gastos.length >= 1) {
        this.submitted = false;
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
        if(this.id_of){
          this.submitted = false;
          this.usuario = this.gastoU['resp_asg'];
          this.gasto['id_partida'] = this.gastoU['id_partida'];
          this.gasto['resp_asg'] = this.usuario;
          this.gasto['comprobantes'] = this.gastoU.comprobantes; 
          this.partidaActual['sobrante'] = (Number(this.saldoDisp) + Number(this.gastoU['cantidad']) ) - Number(this.gasto.cantidad);
          this.gstS.cudGastosOF().doc(this.id_of).update(this.gasto);
          this.gstS.cudPartida().doc(this.partidaActual.id_partidafb).update(this.partidaActual);
          this.regresar();
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
      this.archivos = [];
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

  async cargarArchivos() {
    this._fileS.CARPETA_FILES = 'comprobantes';
    let algo: FileItem[] = await new Promise((resolve, reject) => {
      this._fileS.cargarArchivosFb( this.archivos).finally(() => { resolve(this.archivos); })
      .catch(() => reject([]));
    });
  }

  limpiarArchivos(archivo) {
    this.archivos.splice(archivo, 1);
  }

}

