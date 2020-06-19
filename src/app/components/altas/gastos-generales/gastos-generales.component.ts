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

  // tslint:disable-next-line: variable-name
  constructor( private _fileS: ArchivosService,  private _user: UsuariosService, private _pyt: ProyectosService, private _gastoS: GastosService,
               private active: ActivatedRoute,private formBuilder: FormBuilder, private router: Router, private utils: Utils, public alert: AlertasService ) {
    this.loading = false;
    this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
    this._gastoS.cargarTipoGtos().subscribe((tipoGtos: any[]) => { this.tipoGto = tipoGtos; });
    this._pyt.cargarProyectos().subscribe((proyectos: Proyecto[]) => {this.proyectos = proyectos; });
    this.gastosForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      cantidad: ['', Validators.required],
      motivo: ['', Validators.required],
      tipo_gasto: ['', Validators.required],
      proyecto: ['', Validators.required],
      estatus: ['', Validators.required],
      reembolso: [''],
      comprobantes: ['']
    });
    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      usuarios.filter( usuario => {
        if ( usuario.correo === this.usuarioLocal['usuario'].username) {
          this.usuarioActual = usuario;
          if (usuario['rol'] === 'Administrador') { this.admin = true; } else
          if (usuario['rol'] === 'Aprobador') { this.aprobador = true; } else
          if (usuario['rol'] === 'Financiero') { this.financiero = true; } else
          if (usuario['rol'] === 'Tesorero') { this.tesorero = true; }
            this.gastosForm.get(['estatus']).setValue('Aprobado');
            this.gastosForm.get(['proyecto']).setValue('Proyecto');
            this.gastosForm.get(['tipo_gasto']).setValue('Tipo gasto');
            this.gastosForm.controls['estatus'].disable();

      }
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
        this.gastosForm.get(['tipo_gasto']).setValue(this.updateG.tipo_gasto);
        this.gastosForm.get(['proyecto']).setValue(this.updateG.proyecto);
        this.gastosForm.get(['estatus']).setValue(this.updateG.estatus);
        this.gastosForm.get(['comprobantes']).setValue(this.updateG.comprobantes);
        this.proyectos.filter(proyecto => {
          if (proyecto.nombre === this.updateG.proyecto) {
            this.saldoDisp = proyecto.monto_d;
            this.proyecto = proyecto;
          } });
          this.sameU = this.usuarioActual['correo'] === this.updateG.solicitante;

          if (this.sameU) {
            this.gastosForm.controls['estatus'].disable();
          if (this.updateG.estatus === 'Aprobado') {
            this.gastosForm.disable();
            this.gastosForm.controls['estatus'].enable();
          }
          if (this.updateG.estatus === 'Pagado') {
            this.gastosForm.get(['estatus']).setValue('Pagado');
            this.gastosForm.disable();
          } }
          if ((this.tesorero || this.financiero) && !this.sameU) {
            this.gastosForm.disable();
            this.gastosForm.controls['estatus'].enable();
          
      } else {
      this.gastosForm.get(['estatus']).setValue('Aprobado');
      this.gastosForm.controls['estatus'].disable();
      }
    });
    } 
  });


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
        this.submitted = false;
        this.gasto['comprobantes'] = this.updateG.comprobantes;
        this.proyecto['monto_d'] = (Number(this.saldoDisp) + Number(this.updateG['cantidad'])) - Number(this.gasto['cantidad']);
        this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
        this._gastoS.cudGastos().doc(this.id_gasto).update(this.gasto);
        this.alert.showSuccess();
        this.loading = false;
        this.router.navigate(['gastos']);
      }
      if (!this.id_gasto && this.gastosForm.valid) {
        this.loading = true;
        this.fecha = this.gastosForm.value.fecha;
        this.submitted = false;
        this.gasto.estatus = 'Aprobado';
        this.gasto.solicitante = this.usuarioLocal.usuario.username; if( this.tesorero || this.financiero){
        this.proyecto['monto_d'] = this.proyecto['monto_d'] - this.gasto['cantidad'];
        this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
        }
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
    this.gastosForm.get(['estatus']).setValue('Aprobado');
    this.gastosForm.get(['proyecto']).setValue('Proyecto');
    this.gastosForm.get(['tipo_gasto']).setValue('Tipo gasto');
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

}
