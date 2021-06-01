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
  usuarios = [];
  tipoGto: any[];
  proyectos: any = [];
  gastosForm: FormGroup;
  gasto = new Gasto;
  fecha: string;
  // tslint:disable-next-line: variable-name
  id_gasto: string;
  updateG= new Gasto;
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
  proyecto = new Proyecto;
  userLog = JSON.parse(sessionStorage.getItem('currentUser'));
  admin: boolean;
  aprobador: boolean;
  financiero: boolean;
  tesorero: boolean;
  sameU: boolean;
  estaSobreElemento = false;
  clicked = false;
  status: string;
  botonCancelar = 'Cancelar';
  lideres: any = [];

  // tslint:disable-next-line: variable-name
  constructor( private _fileS: ArchivosService,  private _user: UsuariosService, private _pyt: ProyectosService, private _gastoS: GastosService,
               private active: ActivatedRoute,private formBuilder: FormBuilder, private router: Router, private utils: Utils, public alert: AlertasService ) {
    this._gastoS.cargarTipoGtos().subscribe(tipoGtos =>  this.tipoGto = tipoGtos);
    this._pyt.cargarProyectos().subscribe(proyectos =>{
      if(this.userLog['rol'] == 'Administrador' || this.userLog['rol'] == 'Tesorero'){
        this.proyectos = proyectos;
      } else {
      this.proyectos = [];
      proyectos.filter(proyecto => {
        if(this.userLog.rol == 'Aprobador' && proyecto['resp_asg'] === this.userLog.email ){
           this.proyectos.push(proyecto);
        }
        });
      }
      });
    this.gastosForm = this.formBuilder.group({
      fecha: [{value: '', disabled : true}, Validators.required],
      cantidad: ['', Validators.required],
      motivo: ['', Validators.required],
      tipo_gasto: ['Tipo Gasto', Validators.required],
      proyecto: ['Proyecto', Validators.required],
      estatus: [{value:'Pagado', disabled: true}, Validators.required],
      reembolso: [false],
      comprobantes: [''],
      observacionesaprobador: [''],
      observacionespagado: [''],
      solicitante: ['ASG']
    });
    this._user.cargarUsuarios().subscribe( usuarios => {
      this.usuarios = usuarios;
      usuarios.filter( usuario => {
        if (usuario['resp_area'] === true) {
          this.lideres.push(usuario);
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
        console.log(this.updateG.estatus)
        this.gastosForm.get(['fecha']).setValue(this.updateG.fecha);
        this.gastosForm.get(['cantidad']).setValue(this.updateG.cantidad);
        this.gastosForm.get(['motivo']).setValue(this.updateG.motivo);
        this.gastosForm.get(['reembolso']).setValue(this.updateG.reembolso);
        this.gastosForm.get(['tipo_gasto']).setValue(this.updateG.tipo_gasto);
        this.gastosForm.get(['estatus']).setValue(this.updateG.estatus);
        this.gastosForm.get(['comprobantes']).setValue(this.updateG.comprobantes);
        this.gastosForm.get(['observacionesaprobador']).setValue(this.updateG.observacionesaprobador);
        this.gastosForm.get(['observacionespagado']).setValue(this.updateG.observacionespagado);
        this.gastosForm.get(['proyecto']).setValue(this.updateG.proyecto);
        this.proyecto = this.proyectos.find((response: Proyecto) =>  response['nombre'].toLowerCase() === this.updateG.proyecto.toLowerCase())

        
        this.sameU = this.userLog['email'] === this.updateG.solicitante;
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
this.loading = false;

    }

  get fval() { return this.gastosForm.controls; }

    onSubmit() {
      this.gasto = this.gastosForm.value;
      this.loading = true;
      this.submitted = true;
      this.arrayUrl = [];
      if (this.fval.solicitante.value === 'ASG' && this.userLog.rol === 'Tesorero') {
        this.gastosForm.get(['solicitante']).setErrors({required: true});
      }
      if (this.fval.proyecto.value == 'Proyecto') {
        this.gastosForm.get(['proyecto']).setErrors({required: true});
      }
      if (this.fval.fecha.value == '') {
        this.gastosForm.get(['fecha']).setErrors({required: true});
      }
      if (this.fval.tipo_gasto.value == 'Tipo Gasto') {
        this.gastosForm.get(['tipo_gasto']).setErrors({required: true});
      }
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
        if (this.userLog.rol !== 'Aprobador' &&  !this.sameU) {
          if (this.gasto.estatus === 'Pagado') {
            this.gasto.fechaPago = new Date();
            this.gasto.pago = this.userLog.email;
            this.gasto.reembolso = false;
            this.proyecto['monto_d'] = Number(this.saldoDisp) - Number(this.updateG.cantidad);
          }
        }
        if (this.sameU) {
          this.proyecto['monto_d'] = (Number(this.saldoDisp) + Number(this.updateG.cantidad));

        }
        console.log(this.proyecto.id_proyecto)
        this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
        this._gastoS.cudGastos().doc(this.id_gasto).update(this.gasto);
        this.alert.showSuccess();
        this.loading = false;
        this.gasto['comprobantes'] = this.updateG.comprobantes;
        this.router.navigate(['gastos']);
      }
    if (!this.id_gasto && this.gastosForm.valid) {
      this.gasto.createdby = this.userLog.email;
      if(this.userLog.rol === 'Aprobador'){
        this.gasto.solicitante = this.userLog.email;
      }
      
      this.gasto.aprobo = this.userLog.email;
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

    this.gastosForm.get(['estatus']).setValue('Pagado');
    this.gastosForm.get(['proyecto']).setValue('Proyecto');
    this.gastosForm.get(['tipo_gasto']).setValue('Tipo Gasto');
    this.gastosForm.get(['solicitante']).setValue('ASG');
    this.gastosForm.get(['fecha']).disable();
    this.archivos = [];
    this.saldoDisp = 0;
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
  buscarProyecto(valor) {
    const nombre = valor.toLowerCase();
   

    this.proyecto = this.proyectos.find(response => nombre === response.nombre.toLowerCase());

    this.gastosForm.get(['fecha']).enable();
    this.saldoDisp = this.proyecto['monto_d'];
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
