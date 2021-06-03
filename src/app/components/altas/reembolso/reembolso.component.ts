import { Component, OnInit } from '@angular/core';
import { UsuariosService, ArchivosService, ProyectosService, GastosService, AlertasService  } from '../../../services';
import { Proyecto, FileItem, Reembolso } from '../../../general/model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';

@Component({
  selector: 'app-reembolso',
  templateUrl: './reembolso.component.html',
  styleUrls: ['./reembolso.component.css']
})
export class ReembolsoComponent implements OnInit {
  exito: boolean ;
  nuevoR = true;
  titulo = 'Solicitar Reembolso';
  boton = 'Guardar';
  usuarios = [];
  tipoGto: any[];
  proyectos = [];
  reembolsoForm: FormGroup;
  reembolso = new Reembolso;
  fecha: string;
  // tslint:disable-next-line: variable-name
  id_reembolso: string;
  updateR = new Reembolso;
  textError: string;
  submitted = false;
  loading = true;
  actualizar = false;
  nameFile: string;
  ruta = 'gs://gastos-asg.appspot.com/comprobantes/';
  estaSobreElemento = false;
  archivos: FileItem[] = [];
  comprobantes: any;
  file: FileItem;
  headTitle = ['Nombre', 'Progreso'];
  comprobante: string;
  arrayUrl: any[] = [];
  botonCancelar = 'Cancelar';
  aprobar: any;
  userLog = JSON.parse(sessionStorage.getItem('currentUser'));
  usuarioActual: any;
  same =  false;
  admin: boolean;
  tesorero: boolean;
  aprobador: boolean;
  financiero: boolean;
  uaprobo: string;
  proyecto = new Proyecto;
  project= new Proyecto;
  // tslint:disable-next-line: variable-name
  constructor( private _fileS: ArchivosService, private _pyt: ProyectosService, private __gastoS: GastosService,
               private user: UsuariosService, private formBuilder: FormBuilder, private router: Router,
               private _gastoS: GastosService, private active: ActivatedRoute,  private utils: Utils, public alert: AlertasService ) {

                this.user.cargarUsuarios().subscribe(usuarios =>this.usuarios = usuarios);
                this._gastoS.cargarTipoGtos().subscribe(tipoGtos =>  this.tipoGto = tipoGtos);
                this.reembolsoForm = this.formBuilder.group({
                   fecha: [{value:'', disabled: true}, Validators.required],
                   cantidad: ['', Validators.required],
                   motivo: ['', Validators.required],
                   estatus: [''],
                   comprobantes: [''],
                   tipo_gasto: ['Tipo Gasto', Validators.required],
                   solicitante: ['', Validators.email],
                   observacionesaprobador: [''],
                   observacionespagado: [''],
                   proyecto: ['Proyecto', Validators.required]
                  });

                 this.id_reembolso = this.active.snapshot.paramMap.get('id_reembolso');
                 if ( this.id_reembolso ) {
                  this.titulo = 'Modificar Reembolso';
                  this.actualizar = true;
                  this.__gastoS.cudReembolsos().doc(this.id_reembolso).valueChanges().subscribe((upR: Reembolso) => {
                    this.updateR = upR;
                    this.reembolsoForm.get(['fecha']).setValue(this.updateR.fecha);
                    this.reembolsoForm.get(['cantidad']).setValue(this.updateR.cantidad);
                    this.reembolsoForm.get(['motivo']).setValue(this.updateR.motivo);
                    this.reembolsoForm.get(['comprobantes']).setValue(this.updateR.comprobantes);
                    this.reembolsoForm.get(['solicitante']).setValue(this.updateR.solicitante);
                    this.reembolsoForm.get(['estatus']).setValue(this.updateR.estatus);
                    this.reembolsoForm.get(['tipo_gasto']).setValue(this.updateR.tipo_gasto);
                    this.reembolsoForm.get(['proyecto']).setValue(this.updateR.proyecto);
                    this.reembolsoForm.get(['observacionesaprobador']).setValue(this.updateR.observacionesaprobador);
                    this.reembolsoForm.get(['observacionespagado']).setValue(this.updateR.observacionespagado);
                    this.same = this.userLog['email'] === this.updateR.solicitante;

                    if (this.same) {
                      this.reembolsoForm.controls['estatus'].disable();
                      this.reembolsoForm.controls['observacionesaprobador'].disable();
                      this.reembolsoForm.controls['observacionespagado'].disable();
                      if (this.updateR.estatus !== 'Solicitar') {
                        this.reembolsoForm.disable();
                        this.botonCancelar = 'Regresar';
                      }
                    }
                    if (!this.same) {
                      this.reembolsoForm.disable();
                      this.reembolsoForm.controls['estatus'].enable();
                      if ( this.aprobador) {
                        this.reembolsoForm.controls['observacionesaprobador'].enable();
                      } else {
                        this.reembolsoForm.controls['observacionespagado'].enable();
                      }
                    }
                  });
                } else {
                this.reembolsoForm.get(['estatus']).setValue('Solicitar');
                this.reembolsoForm.get(['proyecto']).setValue('Proyecto');
                this.reembolsoForm.controls['estatus'].disable();
                this.reembolsoForm.controls['observacionesaprobador'].disable();
                this.reembolsoForm.controls['observacionespagado'].disable();
                }
                 this._pyt.cargarProyectos().subscribe((proyectos: Proyecto[]) => {
                  this.proyectos = proyectos;
                  this.proyectos.filter(proyecto => {
                    if(this.id_reembolso){
                      if (this.updateR.proyecto === proyecto.nombre ) { this.project = proyecto; } }
                    });
                 });
                 this.__gastoS.cargarTipoGtos().subscribe((tipoGtos: any[]) => { this.tipoGto = tipoGtos; });
  }

  ngOnInit() {
    this.loading = false;
  }

  get fval() {
    return this.reembolsoForm.controls;
}

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    this.arrayUrl = [];
    this.archivos.filter( data => {
      if (data.url !== 'NO TIENE URL') {
        this.arrayUrl.push(data.url);
      }
    });
    if (this.archivos.length === 0) {
      this.comprobantes = '';
    } else {
      console.log('entro aqui')
      this.comprobantes = this.arrayUrl.join(',');
    }
    this.reembolsoForm.value.comprobantes = this.comprobantes;
    if (this.fval.solicitante.value == '' && this.userLog.rol !== 'Usuario' ) {
      this.reembolsoForm.get(['solicitante']).setErrors({required: true});
    }
    if (this.fval.proyecto.value == 'Proyecto') {
      this.reembolsoForm.get(['proyecto']).setErrors({required: true});
    }
    if (this.fval.fecha.value == '') {
      this.reembolsoForm.get(['fecha']).setErrors({required: true});
    }
    if (this.fval.tipo_gasto.value == 'Tipo Gasto') {
      this.reembolsoForm.get(['tipo_gasto']).setErrors({required: true});
    } if(this.updateR.estatus === 'Aprobado' || this.updateR.estatus === 'Rechazado'  ){
      this.reembolsoForm.get(['observacionesaprobador']).setErrors({required: true});
    } if(this.updateR.estatus === 'Pagado'){
      this.reembolsoForm.get(['observacionespagado']).setErrors({required: true});
    }
    if (!this.reembolsoForm.valid ) {
      this.alert.formInvalid();
      this.loading = false;
      return ;
    }
    if (this.id_reembolso && this.reembolsoForm.valid) {
      this.reembolso = this.reembolsoForm.value;
      this.reembolso.solicitante = this.updateR.solicitante;
      this.submitted = false;
      if (this.reembolso.estatus !== 'Pagado'  ) {
      this.proyecto = this.project;
      this.reembolso.aprobo = this.userLog.email;
      this.reembolso.fechaAprobador = new Date();
      this.reembolso.observacionespagado = '';
      }
      if (this.reembolso.estatus === 'Pagado' ) {
        this.proyecto = this.project;
        this.reembolso.aprobo = this.updateR.aprobo;
        this.reembolso.fechaPagado = new Date();
        this.reembolso.pago = this.userLog.email;
        this.proyecto['monto_d'] = Number(this.proyecto['monto_d']) - Number(this.updateR.cantidad);
      }
      if (this.reembolso.estatus === ('Solicitar') ) {
        this.reembolso.aprobo = '';
        this.reembolso.pago = '';

      }
      this.reembolso['comprobantes'] = this.updateR.comprobantes;
      this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
      this.__gastoS.cudReembolsos().doc(this.id_reembolso).update(this.reembolso);
      this.alert.showSuccess();
      this.loading = false;
      this.router.navigate(['reembolsos']);
      }
    if (!this.id_reembolso && this.reembolsoForm.valid) {
      this.submitted = false;
      this.reembolso = this.reembolsoForm.value;
      this.fecha = this.reembolsoForm.value.fecha;
      
      if(this.userLog.rol === 'Usuario'){
        this.reembolso.solicitante = this.userLog.email;
        
      }
      this.reembolso.createdby = this.userLog.email;
      this.reembolso.estatus = 'Solicitar';
      if (this.archivos.length === 0) {
        this.comprobantes = '';
      } else {
        console.log('entro aqui')
        this.comprobantes = this.arrayUrl.join(',');
      }
      console.log('rembolso',this.reembolso.comprobantes)
      this.__gastoS.cudReembolsos().add(this.reembolso);
      this.alert.showSuccess();
      this.loading = false;
      this.limpiar();
    }
  }

  checkLetras($event: KeyboardEvent) { this.utils.letras($event); }
  checkNumeros($event: KeyboardEvent) { this.utils.numerosp($event); }
  checkL_N($event: KeyboardEvent) { this.utils.letrasNumeros($event); }

  limpiar() {
  this.submitted = false;
  this.loading = false;
  this.reembolsoForm.reset();
  this.reembolsoForm.get(['estatus']).setValue('Solicitar');
  this.reembolsoForm.get(['proyecto']).setValue('Proyecto');
  this.reembolsoForm.get(['tipo_gasto']).setValue('Tipo Gasto');
  this.reembolsoForm.get(['fecha']).disable();
  this.archivos = [];
  }

  regresar() { this.router.navigate(['reembolsos']); }

  async cargarArchivos() {
  this._fileS.CARPETA_FILES = 'comprobantes';
  let algo: FileItem[] = await new Promise((resolve, reject) => {
    this._fileS.cargarArchivosFb( this.archivos).finally(() => { resolve( this.archivos); }).catch(() => reject([]));
    });
  }

  async botonFiles(event) {

  const file = new FileItem(event.target.files[0]);
  this.archivos.push(file);
  this.cargarArchivos();
  }

  limpiarArchivos(arr, i) {
  const archivo = arr.indexOf(i);
  this.archivos.splice( archivo, 1);
  }
  valor(nombre) {
    this.reembolsoForm.get(['fecha']).enable();
    this.proyectos.filter(proyecto => {
    if (nombre === proyecto.nombre) { this.proyecto = proyecto; } });
  }


changeStatus(status){
  if(status === 'Pagado'){
    this.reembolsoForm.controls['observacionespagado'].enable();
    this.reembolsoForm.controls['observacionesaprobador'].disable();
    this.reembolsoForm.get(['observacionespagado']).setErrors({required: true});
    
  } else if(status === 'Aprobado' || status === 'Rechazado'){
    
    this.reembolsoForm.controls['observacionesaprobador'].enable();
    this.reembolsoForm.controls['observacionespagado'].disable();
    this.reembolsoForm.get(['observacionesaprobador']).setErrors({required: true});
  }
}
}
