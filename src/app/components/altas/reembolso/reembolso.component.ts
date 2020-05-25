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

  // tslint:disable-next-line: variable-name
  constructor( private _fileS: ArchivosService,
               private storage: AngularFireStorage,
               private formBuilder: FormBuilder,
               // tslint:disable-next-line: variable-name
               private _user: UsuariosService,
               // tslint:disable-next-line: variable-name
               private _pyt: ProyectosService,
               // tslint:disable-next-line: variable-name
               private __gastoS: GastosService,
               private active: ActivatedRoute,
               private router: Router,
               private utils: Utils,
               public alert: AlertasService
               ) {
    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => { this.usuarios = usuarios;  });
    this._pyt.cargarProyectos().subscribe((proyectos: Proyecto[]) => { this.proyectos = proyectos; });
    this.__gastoS.cargarTipoGtos().subscribe((tipoGtos: any[]) => { this.tipoGto = tipoGtos; });

    this.reembolsoForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      cantidad: ['', Validators.required],
      motivo: ['', Validators.required],
      estatus: [''],
      comprobantes: [''],
      solicitante: [''],
      aprobo: ['']
  });

    this.id_reembolso = this.active.snapshot.paramMap.get('id_reembolso');
    if ( this.id_reembolso ) {
      this.nuevoR = false;
      this.titulo = 'Modificar Reembolso';
      this.actualizar = true;
      this.__gastoS.cudReembolsos().doc(this.id_reembolso).valueChanges().subscribe((upR: Reembolso) => {
        this.updateR = upR;
        this.reembolsoForm.get(['fecha']).setValue(this.updateR.fecha);
        this.reembolsoForm.get(['cantidad']).setValue(this.updateR.cantidad);
        this.reembolsoForm.get(['motivo']).setValue(this.updateR.motivo);
        this.reembolsoForm.get(['estatus']).setValue(this.updateR.estatus);
        this.reembolsoForm.get(['comprobantes']).setValue(this.updateR.comprobantes);
        this.reembolsoForm.get(['solicitante']).setValue(this.updateR.solicitante);
      });
      } else {
        this.nuevoR = true;
        this.reembolsoForm.value.status = 'Aprobar';
        this.aprobar = this.reembolsoForm.value.estatus;
        this.reembolsoForm.controls['estatus'].disable();
      }
  }

  ngOnInit() {
    this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
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
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
    }
    if (this.id_reembolso && this.reembolsoForm.valid) {
      this.reembolso = this.reembolsoForm.value;
      this.reembolso.solicitante = this.updateR.solicitante;
      this.submitted = false;
      if (this.reembolso.estatus !== 'Aprobar' ) {
      this.reembolso.aprobo = this.usuarioLocal.usuario.username;
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
      this.reembolsoForm.value.estatus = 'Aprobar';
      const solicitante = this.usuarioLocal.usuario.username;
      this.reembolso.solicitante = solicitante;
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
  this.archivos = [];
}
regresar() {
  this.router.navigate(['reembolsos']);
}

async cargarArchivos() {
  let algo: FileItem[] = await new Promise((resolve, reject) => {
    this._fileS.cargarArchivosFb( this.archivos).finally(() => { resolve(this.archivos); })
    .catch(() => reject([]));
  });
}


limpiarArchivos(archivo) {
  this.archivos.splice(archivo, 1);
//  this.storage.storage.refFromURL(this.ruta + archivo.nombreArchivo).delete();
}


}
