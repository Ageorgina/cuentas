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
import { AreasService } from '../../../services/areas.service';

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
  loading = true;
  actualizar = false;
  checked = true;
  areas: any;
               // tslint:disable-next-line: variable-name
  constructor( private formBuilder: FormBuilder, private _user: UsuariosService, private _proyectoS: ProyectosService,
               // tslint:disable-next-line: variable-name
               private _gst: GastosService, private _cte: ClientesService, private _areas: AreasService,
               private active: ActivatedRoute, private router: Router, public alert: AlertasService, private utils: Utils,
               ) {
    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => { this.usuarios = usuarios; });
    this._cte.cargarClientes().subscribe((cts: Cliente[]) => { this.clientes = cts; } );
    this._gst.cargarGastos().subscribe((gastos: Gasto[]) => { this.gastos = gastos; });
    this._areas.cargarAreas().subscribe((areas: any[]) => { this.areas = areas; });


    this.proyectosForm = this.formBuilder.group({
      fechaini: ['', Validators.required],
      fechafin: [''],
      monto_p: ['', Validators.required],
      monto_d: [''],
      tipo_proyecto: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estatus: ['', Validators.required],
      empresa: ['', Validators.required],
      resp_cte: ['', Validators.required],
      resp_asg: ['',Validators.required],
      proceso: [''],
      id_act: [''],
      desc_act: [''],
  });
    this.id_proyecto = this.active.snapshot.paramMap.get('id_proyecto');
    if (this.id_proyecto) {
      this.titulo = 'Modificar Proyecto';
      this.actualizar = true;
      this._proyectoS.cudProyectos().doc(this.id_proyecto).valueChanges().subscribe((upP: Proyecto) => {
        this.updateP = upP;
        this.proyectosForm.get(['resp_asg']).setValue(this.updateP.resp_asg);
        this.proyectosForm.get(['nombre']).setValue(this.updateP.nombre);
        this.proyectosForm.get(['empresa']).setValue(this.updateP.empresa);
        this.proyectosForm.get(['descripcion']).setValue(this.updateP.descripcion);
        this.proyectosForm.get(['tipo_proyecto']).setValue(this.updateP.tipo_proyecto);
        this.proyectosForm.get(['fechaini']).setValue(this.updateP.fechaini);
        this.proyectosForm.get(['fechafin']).setValue(this.updateP.fechafin);
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
    this.loading = false;
  }
  get fval() {
    return this.proyectosForm.controls;
  }
  onSubmit() {
    this.loading = true;
    this.submitted = true;
    if (!this.proyectosForm.valid) {
      this.alert.formInvalid();
      this.loading = false;
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
      this.loading = false;
      }
    if (!this.id_proyecto && this.proyectosForm.valid) {
      this.loading = false;
      this.submitted = false;
      this.proyecto = this.proyectosForm.value;
      this.monto_d = this.proyectosForm.value.monto_p; // pediente
      this.proyectosForm.value.monto_d = this.monto_d;
      this._proyectoS.cudProyectos().add(this.proyecto);
      this.alert.showSuccess();
      this.limpiar();
      this.loading = false;
  }
}
limpiar() {
  this.loading = false;
  this.proyectosForm.reset();
}

checkNumeros($event: KeyboardEvent) {
  this.utils.numerosp($event);
}
checkCaracteres($event: KeyboardEvent) {
  this.utils.letrasCaracteres($event);
}
regresar() {
  this.router.navigate(['proyectos']);
}
cambiocte(event) {
  console.log('cambio', event.target.checked);
  if(event.target.checked === true ) {
    this.checked = true;
  } else {
    this.checked = false;
  }
}

}
