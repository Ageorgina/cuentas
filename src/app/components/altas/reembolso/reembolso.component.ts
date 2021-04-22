import { Component, OnInit } from '@angular/core';
import { UsuariosService, ArchivosService, ProyectosService, GastosService, AlertasService  } from '../../../services';
import { Usuario, Proyecto, FileItem, Reembolso } from '../../../general/model';
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
  usuarios: Usuario[] = [];
  tipoGto: any[];
  proyectos: Proyecto[] = [];
  reembolsoForm: FormGroup;
  reembolso: Reembolso;
  fecha: string;
  // tslint:disable-next-line: variable-name
  id_reembolso: string;
  updateR: Reembolso;
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
  usuarioLocal: any;
  usuarioActual: any;
  sameU: boolean;
  admin: boolean;
  tesorero: boolean;
  aprobador: boolean;
  financiero: boolean;
  uaprobo: string;
  proyecto: any;
  project: {} = {};
  // tslint:disable-next-line: variable-name
  constructor( private _fileS: ArchivosService, private _pyt: ProyectosService, private __gastoS: GastosService,
               private user: UsuariosService, private formBuilder: FormBuilder, private router: Router,
               private active: ActivatedRoute,  private utils: Utils, public alert: AlertasService ) {
                 this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));

                 this.user.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                  this.usuarios = usuarios;
                  usuarios.filter( usuario => {
                    if ( usuario.correo === this.usuarioLocal['usuario'].username) {
                      this.usuarioActual = usuario;
                      if (usuario['rol'] === 'Administrador') { this.admin = true; } else
                      if (usuario['rol'] === 'Aprobador') { this.aprobador = true; } else
                      if (usuario['rol'] === 'Financiero') { this.financiero = true; } else
                      if (usuario['rol'] === 'Tesorero') { this.tesorero = true; }
                  }
                });
              });

                this.reembolsoForm = this.formBuilder.group({
                   fecha: ['', Validators.required],
                   cantidad: ['', Validators.required],
                   motivo: ['', Validators.required],
                   estatus: [''],
                   comprobantes: [''],
                   solicitante: [''],
                   observacionesaprobador: [''],
                   observacionespagado: [''],
                   proyecto: ['', Validators.required]
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
                    this.reembolsoForm.get(['proyecto']).setValue(this.updateR.proyecto);
                    this.reembolsoForm.get(['observacionesaprobador']).setValue(this.updateR.observacionesaprobador);
                    this.reembolsoForm.get(['observacionespagado']).setValue(this.updateR.observacionespagado);
                    this.sameU = this.usuarioActual['correo'] === this.updateR.solicitante;

                    if (this.sameU) {
                      this.reembolsoForm.controls['estatus'].disable();
                      this.reembolsoForm.controls['observacionesaprobador'].disable();
                      this.reembolsoForm.controls['observacionespagado'].disable();
                      if (this.updateR.estatus !== 'Solicitar') {
                        this.reembolsoForm.disable();
                        this.botonCancelar = 'Regresar';
                      }
                    }
                    if (!this.sameU) {
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
      this.comprobantes = this.arrayUrl.join(',');
    }
    this.reembolsoForm.value.comprobantes = this.comprobantes;
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
      this.reembolso.aprobo = this.usuarioLocal.usuario.username;
      this.reembolso.fechaAprobador = new Date();
      this.reembolso.observacionespagado = '';
      }
      if (this.reembolso.estatus === 'Pagado' ) {
        this.proyecto = this.project;
        this.reembolso.aprobo = this.updateR.aprobo;
        this.reembolso.fechaPagado = new Date();
        this.reembolso.pago = this.usuarioLocal.usuario.username;
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
      this.reembolso.estatus = 'Solicitar';
      const solicitante = this.usuarioLocal.usuario.username;
      this.reembolso.solicitante = solicitante;
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
  this.archivos = [];
  }

  regresar() { this.router.navigate(['reembolsos']); }

  async cargarArchivos() {
    console.log('cargarArchivos')
  this._fileS.CARPETA_FILES = 'comprobantes';
  let algo: FileItem[] = await new Promise((resolve, reject) => {
    this._fileS.cargarArchivosFb( this.archivos).finally(() => { resolve( this.archivos); }).catch(() => reject([]));
    });
  }

  async botonFiles(event) {

  const file = new FileItem(event.target.files[0]);
  this.archivos.push(file);
  console.log('botonFiles archivos',this.archivos)
  this.cargarArchivos();
  }

  limpiarArchivos(arr, i) {
  const archivo = arr.indexOf(i);
  this.archivos.splice( archivo, 1);
  }
  valor(nombre) {
    console.log('valor', nombre)
    this.proyectos.filter(proyecto => {
    if (nombre === proyecto.nombre) { this.proyecto = proyecto; } });
  }
  }
