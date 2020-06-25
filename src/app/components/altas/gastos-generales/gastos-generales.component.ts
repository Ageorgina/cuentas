import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto, Usuario, Proyecto, FileItem } from '../../../general/model';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { ArchivosService, AlertasService, ProyectosService, UsuariosService, GastosService } from '../../../services';

@Component({
  selector: 'app-gastos-generales',
  templateUrl: './gastos-generales.component.html',
  styleUrls: ['./gastos-generales.component.css']
})
export class GastosGeneralesComponent {
  titulo = 'Registrar Gastos Generales';
  boton = 'Guardar';
  usuarios: Usuario[] = [];
  tipoGto: any[];
  proyectos: Proyecto[] = [];
  gastosForm: FormGroup;
  gasto: Gasto;
  fecha: string;
  // tslint:disable-next-line: variable-name
  id_gasto: string;
  updateG: Gasto;
  submitted = false;
  loading = true;
  actualizar = false;
  ruta = 'gs://gastos-asg.appspot.com/comprobantes/';
  archivos: FileItem[] = [];
  comprobantes: any;
  file: FileItem;
  headTitle = ['Nombre', 'Progreso'];
  comprobante: string;
  arrayUrl: string[] = [];
  saldoDisp = 0;
  // tslint:disable-next-line:variable-name
  id_proyecto: string;
  proyecto: any;
  usuarioActual: any;
  usuarioLocal: any;
  admin: boolean;
  aprobador: boolean;
  financiero: boolean;
  tesorero: boolean;
  sameU: boolean;
  estaSobreElemento = false;
  clicked = false;
  status: string;
  botonCancelar = 'Cancelar';
  jefes: any[] = [];

  // tslint:disable-next-line: variable-name
  constructor( private _fileS: ArchivosService,  private _user: UsuariosService, private _pyt: ProyectosService, private _gastoS: GastosService,
               private active: ActivatedRoute,private formBuilder: FormBuilder, private router: Router, private utils: Utils, public alert: AlertasService ) {
    this.loading = false;
    this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
    this._gastoS.cargarTipoGtos().subscribe((tipoGtos: any[]) => { this.tipoGto = tipoGtos; });
    this.gastosForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      cantidad: ['', Validators.required],
      motivo: ['', Validators.required],
      tipo_gasto: ['', Validators.required],
      proyecto: ['', Validators.required],
      estatus: ['', Validators.required],
      reembolso: [''],
      comprobantes: [''],
      observacionesaprobador: [''],
      observacionespagado: [''],
      solicitante: ['']
    });
    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      usuarios.filter( usuario => {
        if (usuario.rol === 'Aprobador') {
          this.loading = false;
          this.jefes.push(usuario);
           }
        if ( usuario.correo === this.usuarioLocal['usuario'].username) {
          this.usuarioActual = usuario;
          if (usuario['rol'] === 'Administrador') { this.admin = true; } else
          if (usuario['rol'] === 'Aprobador') { this.aprobador = true; } else
          if (usuario['rol'] === 'Financiero') { this.financiero = true; } else
          if (usuario['rol'] === 'Tesorero') { this.tesorero = true; }
          this.gastosForm.get(['proyecto']).setValue('Proyecto');
          this.gastosForm.get(['tipo_gasto']).setValue('Tipo gasto');
          this.gastosForm.controls['estatus'].disable();
      }
    });
    });
      this.id_gasto = this.active.snapshot.paramMap.get('id_gasto');
      if ( this.id_gasto ) {
      this.loading = false;
      this.titulo = 'Modificar Gasto';
      this.actualizar = true;
      this._gastoS.cudGastos().doc(this.id_gasto).valueChanges().subscribe((upG: Gasto) => {
        this.updateG = upG;
        this.gastosForm.get(['fecha']).setValue(this.updateG.fecha);
        this.gastosForm.get(['cantidad']).setValue(this.updateG.cantidad);
        this.gastosForm.get(['motivo']).setValue(this.updateG.motivo);
        this.gastosForm.get(['reembolso']).setValue(this.updateG.reembolso);
        this.gastosForm.get(['tipo_gasto']).setValue(this.updateG.tipo_gasto);
        this.gastosForm.get(['proyecto']).setValue(this.updateG.proyecto);
        this.gastosForm.get(['estatus']).setValue(this.updateG.estatus);
        this.gastosForm.get(['comprobantes']).setValue(this.updateG.comprobantes);
        this.gastosForm.get(['observacionesaprobador']).setValue(this.updateG.observacionesaprobador);
        this.gastosForm.get(['observacionespagado']).setValue(this.updateG.observacionespagado);

        this.sameU = this.usuarioActual['correo'] === this.updateG.solicitante;
        if (this.sameU) {
              if ( this.updateG.estatus === 'Pagado' ) {
                  this.gastosForm.disable();
                  this.botonCancelar = 'Regresar';
                } else {
                this.gastosForm.controls['reembolso'].disable();
                }
            } else {
              if ( this.updateG.estatus === 'Aprobado' ) {
                this.gastosForm.disable();
                this.gastosForm.controls['estatus'].enable();
                this.gastosForm.controls['observacionespagado'].enable();
              }
            }
    });
    }
      this._pyt.cargarProyectos().subscribe((proyectos: Proyecto[]) => {
      proyectos.filter(proyecto => {
      if ( this.updateG &&( this.updateG.proyecto === proyecto.nombre)) {
        this.saldoDisp = proyecto.monto_d;
        this.proyecto = proyecto;
      } else {
        this.proyectos = proyectos;
      }
  });
  });
      this.gastosForm.get(['estatus']).setValue('Pagado');
      this.gastosForm.get(['solicitante']).setValue('ASG');
    }

  get fval() { return this.gastosForm.controls; }

    onSubmit() {
      this.gasto = this.gastosForm.value;
      this.loading = true;
      this.submitted = true;
      this.arrayUrl = [];
      this.archivos.filter( data => {
      if (data.url !== 'NO TIENE URL') {
          this.arrayUrl.push(data.url);
        } });
      if (this.archivos.length === 0) {
          this.comprobantes = '';
      } else {
          this.comprobantes = this.arrayUrl.join(',');
      }
    this.gastosForm.value.comprobantes = this.comprobantes;
    if (!this.gastosForm.valid) {
        this.alert.formInvalid();
        this.loading = false;
        return ;
      }
    if (this.id_gasto && this.gastosForm.valid) {
        if (this.usuarioActual.rol !== 'Aprobador' &&  !this.sameU) {
          if (this.gasto.estatus === 'Pagado') {
            this.gasto.fechaPago = new Date();
            this.gasto.pago = this.usuarioLocal.usuario.username;
            this.gasto.reembolso = false;
            this.proyecto['monto_d'] = Number(this.saldoDisp) - Number(this.updateG.cantidad);
          }
        }
        if (this.sameU) {
          this.proyecto['monto_d'] = (Number(this.saldoDisp) + Number(this.updateG.cantidad));

        }
        this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
        this._gastoS.cudGastos().doc(this.id_gasto).update(this.gasto);
        this.alert.showSuccess();
        this.loading = false;
        this.gasto['comprobantes'] = this.updateG.comprobantes;
        this.router.navigate(['gastos']);
      }
    if (!this.id_gasto && this.gastosForm.valid) {
      if(this.usuarioActual.rol === 'Aprobador'){
        this.gasto.solicitante = this.usuarioLocal.usuario.username;
      }
      this.gasto.aprobo = this.usuarioLocal.usuario.username;
      this.loading = true;
        this.fecha = this.gastosForm.value.fecha;
        this.submitted = false;
        if (this.gasto.reembolso !== true) {
          this.gasto.reembolso = false;
          this.gasto.pago = this.gasto.solicitante;
          this.gasto.estatus = 'Pagado';
          this.gasto.fechaAprobo = new Date();
          this.gasto.fechaPago = this.gasto.fechaAprobo;
          this.proyecto['monto_d'] = this.proyecto['monto_d'] - this.gasto['cantidad'];
        } else {
        this.gasto.estatus = 'Aprobado';
        this.gasto.fechaAprobo = new Date();
        }
        this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
        this._gastoS.cudGastos().add(this.gasto);
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
    this.gastosForm.reset();
    this.archivos = [];
    this.saldoDisp = 0;
    this.gastosForm.get(['estatus']).setValue('Pagado');
    this.gastosForm.get(['proyecto']).setValue('Proyecto');
    this.gastosForm.get(['tipo_gasto']).setValue('Tipo gasto');
    this.gastosForm.get(['solicitante']).setValue('ASG');
  }

  async cargarArchivos() {
    this._fileS.CARPETA_FILES = 'comprobantes';
    let algo: FileItem[] = await new Promise((resolve, reject) => {
      this._fileS.cargarArchivosFb( this.archivos).finally(() => { resolve(this.archivos); })
      .catch(() => reject([]));
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
    regresar() {
      this.router.navigate(['gastos']);
    }
  valor(nombre) {
    this.proyectos.filter(proyecto => {
      if (nombre === proyecto.nombre) {
        this.saldoDisp = proyecto.monto_d;
        this.proyecto = proyecto;
      }
    });
  }
  cambio(evento) {
    if ( evento.checked === true) {
      this.clicked = true;
      this.status = this.gastosForm.value.estatus;
      this.gastosForm.get(['estatus']).setValue('Aprobado');
      this.gastosForm.value.estatus = 'Aprobado';
    } else {
      this.clicked = false;
      this.gastosForm.value.estatus = 'Pagado';
      this.gastosForm.get(['estatus']).setValue('Pagado');
      this.status = this.gastosForm.value.estatus;
    }
  }

}
