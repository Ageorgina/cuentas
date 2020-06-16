import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService, ProyectosService, AlertasService, NominaService } from '../../../services';
import { Utils } from '../../../general/utils/utils';
import { Proyecto, Nomina, Usuario } from '../../../general/model';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.css']
})
export class NominaComponent implements OnInit {
  titulo = 'Nómina';
  usuarios: Usuario[] = [];
  proyectos: Proyecto[] = [];
  nominaForm: FormGroup;
  boton = 'Guardar';
  actualizar = false;
  submitted = false;
  loading = false;
  saldoDisp = 0;
  // tslint:disable-next-line: variable-name
  id_proyecto: string;
  proyecto: Proyecto;
  nomina: Nomina;
  // tslint:disable-next-line: variable-name
  id_nomina: string;
  nominaUpdate: Nomina;

  // tslint:disable-next-line:variable-name
  constructor( private formBuilder: FormBuilder, private _user: UsuariosService, private _pyt: ProyectosService,
               private active: ActivatedRoute, private router: Router, private utils: Utils,
               public alert: AlertasService, private nominaS: NominaService) {
                 this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => { this.usuarios = usuarios;  });
                 this._pyt.cargarProyectos().subscribe((proyectos: Proyecto[]) => {this.proyectos = proyectos; });
                 this.nominaForm = this.formBuilder.group({
                   nombre: ['', Validators.required],
                   salario: ['', Validators.required],
                   fechaini: ['', Validators.required],
                   fechafin: ['', Validators.required],
                   proyecto: ['', Validators.required],
                   estatus: [''],
                   salarioReal: ['']
                  });
                 this.nominaForm.get(['estatus']).setValue('Activo');
                 this.nominaForm.get(['estatus']).disable();

                 this.id_nomina = this.active.snapshot.paramMap.get('id_nomina');
                 if ( this.id_nomina ) {
                   this.titulo = 'Modificar Nómina';
                   this.actualizar = true;
                   this.nominaS.cudNomina().doc(this.id_nomina).valueChanges().subscribe((upN: Nomina) => {
                     this.nominaUpdate = upN;
                     this.nominaForm.get(['nombre']).setValue(this.nominaUpdate.nombre);
                     this.nominaForm.get(['salario']).setValue(this.nominaUpdate.salario);
                     this.nominaForm.get(['fechaini']).setValue(this.nominaUpdate.fechaini);
                     this.nominaForm.get(['fechafin']).setValue(this.nominaUpdate.fechafin);
                     this.nominaForm.get(['proyecto']).setValue(this.nominaUpdate.proyecto);
                     this.nominaForm.get(['estatus']).setValue(this.nominaUpdate.estatus);
                     this.nominaForm.get(['estatus']).disable();
                     this.nominaForm.get(['nombre']).disable();
                     this.nominaForm.get(['proyecto']).disable();
                     this.proyectos.filter(proyecto => {
                       if (proyecto.nombre === this.nominaUpdate.proyecto) {
                         this.saldoDisp = proyecto.monto_d;
                         this.proyecto = proyecto;
                       }
                     });
                   });
                   }
                  }



  ngOnInit() {
  }

  onSubmit() {
    this.nomina = this.nominaForm.value;
    if (this.nominaForm.invalid) {
      this.submitted = false;
      this.loading = false;
      this.alert.formInvalid();
      return ;
    }

    if (!this.id_nomina && this.nominaForm.valid) {
      this.nomina.estatus = 'Activo';
      this.nomina.salarioReal = Number(this.nomina.salario * 1.7);
      this.proyecto.monto_d = Number(this.saldoDisp) - Number(this.nomina.salarioReal);
      this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
      this.nominaS.cudNomina().add(this.nomina);
      this.submitted = false;
      this.alert.showSuccess();
      this.loading = false;
      this.limpiar();
      }
    if (this.id_nomina && this.nominaForm.valid) {
        this.nomina.salarioReal = Number(this.nomina.salario * 1.7);
        this.proyecto.monto_d = (Number(this.saldoDisp) + Number(this.nominaUpdate.salarioReal)) - Number(this.nomina.salarioReal);
        this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
        this.nominaS.cudNomina().doc(this.id_nomina).update(this.nomina);
        this.submitted = false;
        this.loading = false;
        this.router.navigate(['descripcion-proyecto', `${this.proyecto.id_proyecto}`]);
      }
  }

  get fval() { return this.nominaForm.controls; }
  checkNumeros($event: KeyboardEvent) { this.utils.numeros($event); }


  limpiar() {
  this.submitted = false;
  this.loading = false;
  this.nominaForm.reset();
  this.saldoDisp = 0;
  }
  regresar() {
  this.router.navigate(['proyectos']);
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
