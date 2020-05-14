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
import { Gasto } from '../../../general/model/gasto';
import { FileItem } from '../../../general/model/file-item';

@Component({
  selector: 'app-reembolso',
  templateUrl: './reembolso.component.html',
  styleUrls: ['./reembolso.component.css']
})
export class ReembolsoComponent implements OnInit {
  exito: boolean ;
  titulo = 'Solicitar Reembolso';
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

    this.gastosForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      cantidad: ['', Validators.required],
      motivo: ['', Validators.required],
      tipo_gasto: ['', Validators.required],
      proyecto: ['', Validators.required],
      estatus: ['', Validators.required],
      reembolso: [''],
      comprobantes: [''],
  });

    this.id_gasto = this.active.snapshot.paramMap.get('id_gasto');
    if ( this.id_gasto ) {
      this.titulo = 'Modificar Gasto';
      this.actualizar = true;
      this.__gastoS.cudGastos().doc(this.id_gasto).valueChanges().subscribe((upG: Gasto) => {
        this.updateG = upG;
        this.gastosForm.get(['fecha']).setValue(this.updateG.fecha);
        this.gastosForm.get(['cantidad']).setValue(this.updateG.cantidad);
        this.gastosForm.get(['motivo']).setValue(this.updateG.motivo);
        this.gastosForm.get(['tipo_gasto']).setValue(this.updateG.tipo_gasto);
        this.gastosForm.get(['proyecto']).setValue(this.updateG.proyecto);
        this.gastosForm.get(['estatus']).setValue(this.updateG.estatus);
        this.gastosForm.get(['comprobantes']).setValue(this.updateG.comprobantes);
      });
      }
  }

  ngOnInit() {
    this.loading = false;
  }

  get fval() {
    return this.gastosForm.controls;
}

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    if (!this.id_gasto && this.gastosForm.invalid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
    }
    if (!this.gastosForm.valid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
    }
    if (this.id_gasto && this.gastosForm.valid) {
      this.submitted = false;
      this.gasto = this.gastosForm.value;
      this.__gastoS.cudGastos().doc(this.id_gasto).update(this.gasto);
      this.alert.showSuccess();
      this.loading = false;
      this.router.navigate(['gastos']);
      }
    if (!this.id_gasto && this.gastosForm.valid) {
      this.submitted = false;
      this.gasto = this.gastosForm.value;
      this.gastosForm.value.comprobantes = this.comprobantes;
      this.fecha = this.gastosForm.value.fecha;
      this.gastosForm.value.comprobantes = this.comprobante;
      this.__gastoS.cudGastos().add(this.gasto);
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
  this.gastosForm.reset();
  this.archivos = [];
}
regresar() {
  this.router.navigate(['gastos']);
}

cargarArchivos() {
  this._fileS.cargarArchivosFb( this.archivos).then(() => {
    this.archivos.filter(file => {
        if (this.arrayUrl.includes(file.url) || file.completo === false) {
          return ;
        } else {
          this.arrayUrl.push(file.url);
          console.log('arrayUrl', this.arrayUrl);
          this.comprobante = this.arrayUrl.join();
        }
    });
  });

}


limpiarArchivos(archivo) {
  this.archivos.splice(archivo, 1);
  this.storage.storage.refFromURL(this.ruta + archivo.nombreArchivo).delete();
}

}
