import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { GastosService } from '../../../services/gastos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto } from '../../../general/model/gasto';
import { Usuario } from '../../../general/model/usuario';
import { Proyecto } from '../../../general/model/proyecto';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-gastos-generales',
  templateUrl: './gastos-generales.component.html',
  styleUrls: ['./gastos-generales.component.css']
})
export class GastosGeneralesComponent implements OnInit {
  exito: boolean ;
  titulo = 'Registrar Gasto';
  boton = 'Guardar';
  usuarios: Usuario[] = [];
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

  constructor( private formBuilder: FormBuilder,
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

    this.gastosForm = this.formBuilder.group({

      resp_asg: ['', Validators.required],
      fecha: ['', Validators.required],
      cantidad: ['', Validators.required],
      motivo: ['', Validators.required],
      tipo_gasto: ['', Validators.required],
      proyecto: ['', Validators.required],
      estatus: ['', Validators.required],
  });

    this.id_gasto = this.active.snapshot.paramMap.get('id_gasto');
    if ( this.id_gasto ) {
      this.titulo = 'Modificar Gasto';
      this.actualizar = true;
      this.__gastoS.cudGastos().doc(this.id_gasto).valueChanges().subscribe((upG: Gasto) => {
        this.updateG = upG;
        this.gastosForm.get(['resp_asg']).setValue(this.updateG.resp_asg);
        this.gastosForm.get(['fecha']).setValue(this.updateG.fecha);
        this.gastosForm.get(['cantidad']).setValue(this.updateG.cantidad);
        this.gastosForm.get(['motivo']).setValue(this.updateG.motivo);
        this.gastosForm.get(['tipo_gasto']).setValue(this.updateG.tipo_gasto);
        this.gastosForm.get(['proyecto']).setValue(this.updateG.proyecto);
        this.gastosForm.get(['estatus']).setValue(this.updateG.estatus);
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
      this.fecha = this.gastosForm.value.fecha;
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
  this.gastosForm.get(['resp_asg']).setValue('');
  this.gastosForm.get(['fecha']).setValue('');
  this.gastosForm.get(['cantidad']).setValue('');
  this.gastosForm.get(['motivo']).setValue('');
  this.gastosForm.get(['tipo_gasto']).setValue('');
  this.gastosForm.get(['proyecto']).setValue('');
  this.gastosForm.get(['estatus']).setValue('');
}
regresar() {
  this.router.navigate(['gastos']);
}

}
