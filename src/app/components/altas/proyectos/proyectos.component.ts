import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { ProyectosService } from '../../../services/proyectos.service';
import { GastosService } from '../../../services/gastos.service';
import { ClientesService } from '../../../services/clientes.service';
import { Proyecto } from '../../../general/model/proyecto';
import { Usuario } from '../../../general/model/usuario';
import { Cliente } from '../../../general/model/cliente';
import { Gasto } from '../../../general/model/gasto';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { AlertasService } from '../../../services/srv_shared/alertas.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  titulo = 'Registrar Proyecto';
  usuarios: Usuario[] =  [];
  clientes: Cliente[] = [];
  proyectosForm: FormGroup;
  proyecto: Proyecto;
  gastos: Gasto[] = [];
  boton = 'Guardar';
  // tslint:disable-next-line: variable-name
  monto_d: number;
  // tslint:disable-next-line: variable-name
  id_proyecto: string;
  updateP: Proyecto;
  textError: string;
  submitted = false;

  constructor( private formBuilder: FormBuilder,
               // tslint:disable-next-line: variable-name
               private _user: UsuariosService,
               // tslint:disable-next-line: variable-name
               private _proyectoS: ProyectosService,
               // tslint:disable-next-line: variable-name
               private _gst: GastosService,
               // tslint:disable-next-line: variable-name
               private _cte: ClientesService,
               private active: ActivatedRoute,
               private router: Router,
               public alert: AlertasService,
               private utils: Utils
               ) {

    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => { this.usuarios = usuarios; });
    this._cte.cargarClientes().subscribe((cts: Cliente[]) => { this.clientes = cts; } );
    this._gst.cargarGastos().subscribe((gastos: Gasto[]) => { this.gastos = gastos; });
    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => { this.usuarios = usuarios; });


    this.proyectosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      cliente: ['', Validators.required],
      descripcion: ['', Validators.required],
      duracion: ['', Validators.required],
      monto_p: ['', Validators.required],
      monto_d: [''],
      resp_asg: ['', Validators.required],
      resp_cte: ['', Validators.required],
      tipo_proyecto: ['', Validators.required],
      estatus: ['', Validators.required],
      proceso: ['', Validators.required],
      id_act: ['', Validators.required],
      desc_act: ['', Validators.required]
  });
    this.id_proyecto = this.active.snapshot.paramMap.get('id_proyecto');
    if (this.id_proyecto) {
      this.titulo = 'Modificar Proyecto';
      this.boton = 'Actualizar';
      this._proyectoS.cudProyectos().doc(this.id_proyecto).valueChanges().subscribe((upP: Proyecto) => {
        this.updateP = upP;
        this.proyectosForm.get(['resp_asg']).setValue(this.updateP.resp_asg);
        this.proyectosForm.get(['nombre']).setValue(this.updateP.nombre);
        this.proyectosForm.get(['cliente']).setValue(this.updateP.cliente);
        this.proyectosForm.get(['descripcion']).setValue(this.updateP.descripcion);
        this.proyectosForm.get(['tipo_proyecto']).setValue(this.updateP.tipo_proyecto);
        this.proyectosForm.get(['duracion']).setValue(this.updateP.duracion);
        this.proyectosForm.get(['monto_p']).setValue(this.updateP.monto_p);
        this.proyectosForm.get(['resp_cte']).setValue(this.updateP.resp_cte);
        this.proyectosForm.get(['estatus']).setValue(this.updateP.estatus);
        this.proyectosForm.get(['proceso']).setValue(this.updateP.proceso);
        this.proyectosForm.get(['resp_cte']).setValue(this.updateP.resp_cte);
        this.proyectosForm.get(['id_act']).setValue(this.updateP.id_act);
        this.proyectosForm.get(['desc_act']).setValue(this.updateP.desc_act);
        this.proyectosForm.get(['monto_d']).setValue(this.updateP.monto_d);
      });
      }

  }

  ngOnInit() {
  }
  get fval() {
    return this.proyectosForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.id_proyecto && this.proyectosForm.invalid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      return ;
    }
    if (!this.proyectosForm.valid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      return ;
    }
    if (this.id_proyecto && this.proyectosForm.valid) {
      this.submitted = false;
      this.proyecto = this.proyectosForm.value;
      this.monto_d = this.proyectosForm.value.monto_p; // pediente
      this.proyectosForm.value.monto_d = this.monto_d;
      this._proyectoS.cudProyectos().doc(this.id_proyecto).update(this.proyecto);
      this.router.navigate(['proyectos']);
      this.alert.showSuccess();
      }
    if (!this.id_proyecto && this.proyectosForm.valid) {
      this.submitted = false;
      this.proyecto = this.proyectosForm.value;
      this.monto_d = this.proyectosForm.value.monto_p; // pediente
      this.proyectosForm.value.monto_d = this.monto_d;
      this._proyectoS.cudProyectos().add(this.proyecto);
      this.alert.showSuccess();
      this.limpiar();
  }
}
limpiar() {
  // tslint:disable-next-line: no-unused-expression
  this.submitted;
  this.proyectosForm.get(['resp_asg']).setValue('');
  this.proyectosForm.get(['nombre']).setValue('');
  this.proyectosForm.get(['cliente']).setValue('');
  this.proyectosForm.get(['descripcion']).setValue('');
  this.proyectosForm.get(['tipo_proyecto']).setValue('');
  this.proyectosForm.get(['duracion']).setValue('');
  this.proyectosForm.get(['monto_p']).setValue('');
  this.proyectosForm.get(['resp_cte']).setValue('');
  this.proyectosForm.get(['estatus']).setValue('');
  this.proyectosForm.get(['proceso']).setValue('');
  this.proyectosForm.get(['resp_cte']).setValue('');
  this.proyectosForm.get(['id_act']).setValue('');
  this.proyectosForm.get(['desc_act']).setValue('');
  this.proyectosForm.get(['monto_d']).setValue('');
}
checkLetras($event: KeyboardEvent) {
  this.utils.letras($event);
}

checkNumeros($event: KeyboardEvent) {
  this.utils.numerosp($event);
}
checkCaracteres($event: KeyboardEvent) {
  this.utils.letrasCaracteres($event);
}

}
