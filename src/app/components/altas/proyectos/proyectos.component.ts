import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService,  ProyectosService, GastosService , ClientesService, AreasService, AlertasService } from '../../../services';
import { Proyecto, Usuario, Cliente, Gasto } from '../../../general/model';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  titulo = 'Registrar Proyecto';
  userLog = JSON.parse(sessionStorage.getItem('currentUser'))
  usuarios =  [];
  clientes = [];
  proyectosForm: FormGroup;
  proyecto = new Proyecto;
  gastos = [];
  boton = 'Guardar';
  // tslint:disable-next-line: variable-name
  monto_d: number;
  // tslint:disable-next-line: variable-name
  id_proyecto: string;
  updateP= new Proyecto;
  textError: string;
  submitted = false;
  loading = true;
  actualizar = false;
  checked = true;
  areas: any;
  empresas = [];
               // tslint:disable-next-line: variable-name
  constructor( private formBuilder: FormBuilder, private _user: UsuariosService, private _proyectoS: ProyectosService,
               // tslint:disable-next-line: variable-name
               private _gst: GastosService, private _cte: ClientesService, private _areas: AreasService,
               private active: ActivatedRoute, private router: Router, public alert: AlertasService, private utils: Utils,
               ) {
    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => { 
      usuarios.filter( x=> {
        if(x.resp_area === true){
          this.usuarios.push(x);
        }
      } )
       });
    this._cte.cargarClientes().subscribe((empresas: Cliente[]) => { this.empresas =  empresas;

      });
    this._gst.cargarGastos().subscribe((gastos: Gasto[]) => { this.gastos = gastos; });
    this._areas.cargarAreas().subscribe((areas: any[]) => { this.areas = areas; });

    this.loading = false;
    this.proyectosForm = this.formBuilder.group({
      fechaini: ['', Validators.required],
      fechafin: [''],
      monto_p: ['', Validators.required],
      monto_d: [''],
      tipo_proyecto: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estatus: ['Estatus', Validators.required],
      empresa: ['Empresa', Validators.required],
      resp_cte: ['Responsable', Validators.required],
      resp_asg: ['ASG',Validators.required],
      proceso: [''],
      id_act: [''],
      desc_act: [''],
      interno: [false]
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
        this.proyectosForm.get(['interno']).setValue(this.updateP.interno);
      });
      }
      // this.proyectosForm.get(['empresa']).setValue('Empresa');
      // this.proyectosForm.get(['resp_asg']).setValue('ASG');
      // this.proyectosForm.get(['estatus']).setValue('Estatus');
      // this.proyectosForm.get(['resp_cte']).setValue('Responsable');

  }

  ngOnInit() {
    this.loading = false;
  }
  empresaSelected(event) {
    this.proyectosForm.get(['resp_cte']).setValue('Responsable');
    this.clientes = [];
    this.empresas.filter( empresa => {
      if ( event.value === empresa.empresa) {
        this.clientes.push(empresa);
      }
    });
  }
  get fval() {
    return this.proyectosForm.controls;
  }
  onSubmit() {
    this.loading = true;
    this.submitted = true;
    if (this.fval.resp_asg.value == 'ASG' ) {
      this.proyectosForm.get(['resp_asg']).setErrors({required: true});
    }
    if ( this.fval.empresa.value == 'Empresa') {
      this.proyectosForm.get(['empresa']).setErrors({required: true});
    }
    if ( this.fval.resp_cte.value == 'Responsable') {
      this.proyectosForm.get(['resp_cte']).setErrors({required: true});
    }
    if ( this.fval.estatus.value == 'Estatus') {
      this.proyectosForm.get(['estatus']).setErrors({required: true});
    }
    if (!this.proyectosForm.valid) {
      this.alert.formInvalid();
      this.loading = false;
      return ;
    }
    if (this.id_proyecto && this.proyectosForm.valid) {
      this.submitted = false;
      this.proyecto = this.proyectosForm.value;
      if (this.proyecto.monto_p !== this.updateP.monto_p) {
        this.proyecto.monto_d = Number(this.proyecto.monto_p)  -  (Number(this.updateP.monto_p) - Number(this.updateP.monto_d) );
      }
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
  this.proyectosForm.get(['empresa']).setValue('Empresa');
  this.proyectosForm.get(['resp_asg']).setValue('ASG');
  this.proyectosForm.get(['estatus']).setValue('Estatus');
  this.proyectosForm.get(['resp_cte']).setValue('Responsable');
  this.proyectosForm.get(['interno']).setValue(false);
  this.proyectosForm.get(['empresa']).enable();
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
  this.proyectosForm.get(['resp_cte']).setValue('Responsable');
  if(event.target.checked === true ) {
    this.proyectosForm.get(['empresa']).setValue('ASG');
    this.proyectosForm.get(['empresa']).disable();
    this.checked = false;
  } else {
    this.checked = true;
    this.proyectosForm.get(['empresa']).enable();
    this.proyectosForm.get(['empresa']).setValue('Empresa');
  }
}

}
