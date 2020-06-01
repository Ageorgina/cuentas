import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/general/utils/utils';
import { AlertasService } from 'src/app/services/srv_shared/alertas.service';
import { Usuario } from '../../../general/model/usuario';
import { Proyecto } from '../../../general/model/proyecto';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FileItem } from '../../../general/model/file-item';
import { Reembolso } from '../../../general/model/reembolso';

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
  aprobar: any;
  usuarioLocal: any;
  usuarioActual: any;
  sameU: boolean;
  admin: boolean;
  tesorero: boolean;
  aprobador: boolean;
  uaprobo: string;
  proyecto: any;

  // tslint:disable-next-line: variable-name
  constructor( private _fileS: ArchivosService, private storage: AngularFireStorage, private formBuilder: FormBuilder,
               // tslint:disable-next-line: variable-name
               private _user: UsuariosService, private _pyt: ProyectosService, private __gastoS: GastosService,
               private active: ActivatedRoute, private router: Router, private utils: Utils,
               public alert: AlertasService
               ) {
                this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                  this.usuarios = usuarios;
                  usuarios.filter( usuario => {
                    if ( usuario.correo === this.usuarioLocal['usuario'].username) {
                    this.usuarioActual = usuario;
                    if (usuario['rol'] === 'Administrador'){
                      this.admin = true;
                    } else if (usuario['rol']=== 'Aprobador'){
                      this.aprobador = true;
                    } else if (usuario['rol'] === 'Tesorero'){
                      this.tesorero = true;
                    }
                  }
                });
              });
                this._pyt.cargarProyectos().subscribe((proyectos: Proyecto[]) => { this.proyectos = proyectos; });
                this.__gastoS.cargarTipoGtos().subscribe((tipoGtos: any[]) => { this.tipoGto = tipoGtos; });

                this.reembolsoForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      cantidad: ['', Validators.required],
      motivo: ['', Validators.required],
      estatus: [''],
      comprobantes: [''],
      solicitante: [''],
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
                    this.sameU = this.usuarioActual['correo'] === this.updateR.solicitante;
                    if (this.sameU) {
                      this.reembolsoForm.controls['estatus'].disable();
                    }
                    if (this.updateR.estatus !== 'Solicitar') {
                      this.reembolsoForm.controls['cantidad'].disable();
                      this.reembolsoForm.controls['proyecto'].disable();
                    }
                    if (this.updateR.estatus === 'Pagado') {
                      this.reembolsoForm.get(['estatus']).setValue('Pagado');
                      this.reembolsoForm.disable();
                    }
                  });
                } else {
                this.reembolsoForm.get(['estatus']).setValue('Solicitar');
                this.reembolsoForm.controls['estatus'].disable();
                }

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
      if (this.reembolso.estatus === ('Aprobado')  ) {
      this.reembolso.aprobo = this.usuarioLocal.usuario.username;
      }
      if (this.reembolso.estatus !== ('Aprobado') ) {
        this.reembolso.aprobo = this.updateR.aprobo;
        this.reembolso.pago = this.usuarioLocal.usuario.username;
        }
      this.reembolso['comprobantes'] = this.updateR.comprobantes;

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
      console.log('solicitar', this.reembolso);
      this.__gastoS.cudReembolsos().add(this.reembolso);
      this.alert.showSuccess();
      this.loading = false;
      this.limpiar();
  }
}
checkLetras($event: KeyboardEvent) {
  this.utils.letras($event);
}

checkNumeros($event: KeyboardEvent) {
  this.utils.numerosp($event);
}
checkL_N($event: KeyboardEvent) {
  this.utils.letrasNumeros($event);
}
limpiar() {
  // tslint:disable-next-line: no-unused-expression
  this.submitted = false;
  this.loading = false;
  this.reembolsoForm.reset();
  this.reembolsoForm.get(['estatus']).setValue('Solicitar');
  this.archivos = [];
}
regresar() {
  this.router.navigate(['reembolsos']);
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
valor(nombre) {
  this.proyectos.filter(proyecto => {
    if (nombre === proyecto.nombre) {
      this.proyecto = proyecto;
    }
  });
}

}
