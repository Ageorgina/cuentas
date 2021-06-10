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
  usuarios = [];
  proyectos = [];
  nominaForm: FormGroup;
  boton = 'Guardar';
  actualizar = false;
  submitted = false;
  loading = false;
  saldoDisp = 0;
  // tslint:disable-next-line: variable-name
  id_proyecto: string;
  proyecto= new Proyecto;
  nomina= new Nomina;
  userLog = JSON.parse(sessionStorage.getItem('currentUser'));

  // tslint:disable-next-line: variable-name
  id_nomina: string;
  nominaUpdate= new Nomina;
  saldoProyecto: number;

  // tslint:disable-next-line:variable-name
  constructor( private formBuilder: FormBuilder, private _user: UsuariosService, private _pyt: ProyectosService, private utils: Utils,
               private active: ActivatedRoute, private router: Router, public alert: AlertasService, private nominaS: NominaService) {
this.init();

                 this.nominaForm = this.formBuilder.group({
                   nombre: ['', Validators.required],
                   salario: ['', Validators.required],
                   fechaini: ['', Validators.required],
                   fechafin: ['', Validators.required],
                   proyecto: ['', Validators.required],
                   aumento: ['', Validators.required],
                   estatus: ['Activo'],
                   salarioReal: [''],
                   monto: [0]
                  });
                 
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
                   this.nominaForm.get(['nombre']).setValue('ASG');
                   this.nominaForm.get(['proyecto']).setValue('Proyecto');
                   this.nominaForm.get(['estatus']).setValue('Activo');
                   this.nominaForm.get(['aumento']).setValue(1.0);
                   this.nominaForm.get(['fechaini']).disable();
                   this.nominaForm.get(['fechafin']).disable();
                  }

                  get fval() { return this.nominaForm.controls; }

  ngOnInit() {
    this.loading = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.fval.nombre.value == 'ASG' ) {
      this.nominaForm.get(['nombre']).setErrors({required: true});
    }
    if (this.fval.proyecto.value == 'Proyecto') {
      this.nominaForm.get(['proyecto']).setErrors({required: true});
    }

    if (this.nominaForm.invalid == true) {

      this.loading = false;
      this.alert.formInvalid();
      return ;
    }
    this.nomina = this.nominaForm.value;
    if (!this.id_nomina && this.nominaForm.valid) {
      this.nomina.estatus = 'Activo';
      this.sueldoP();
      this.proyecto.monto_d = Number(this.saldoDisp) - Number(this.saldoProyecto);
      this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
      this.nominaS.cudNomina().add(this.nomina);
      this.submitted = false;
      this.alert.showSuccess();
      this.loading = false;
      this.limpiar();
      }
    if (this.id_nomina && this.nominaForm.valid) {
      const saldoDiaPass = Number(this.nominaUpdate.salarioReal) / 30;
      const dateIniPass = new Date(this.nominaUpdate.fechaini);
      const dateEndPass = new Date(this.nominaUpdate.fechafin);
      const diferencia = dateEndPass.getTime() - dateIniPass.getTime();
      const daysPass = diferencia / (60 * 60 * 24 * 1000);
      const saldoProyectoPass = saldoDiaPass *  (daysPass + 1);
      this.sueldoP();
      this.proyecto.monto_d = (Number(this.saldoDisp) + Number(saldoProyectoPass)) - Number(this.saldoProyecto);
      this._pyt.cudProyectos().doc(this.proyecto.id_proyecto).update(this.proyecto);
      this.nominaS.cudNomina().doc(this.id_nomina).update(this.nomina);
      this.submitted = false;
      this.loading = false;
      this.router.navigate(['descripcion-proyecto', `${this.proyecto.id_proyecto}`]);
      }
  }

 
  checkNumeros($event: KeyboardEvent) { this.utils.numerosp($event); }


  limpiar() {
  this.submitted = false;
  this.loading = false;
  this.nominaForm.reset();
  this.usuarios = [];
  this.proyectos = [];
  this.saldoDisp = 0;
  this.nominaForm.get(['nombre']).setValue('ASG');
  this.nominaForm.get(['proyecto']).setValue('Proyecto');
  this.nominaForm.get(['estatus']).setValue('Activo');
  this.nominaForm.get(['aumento']).setValue(1.0);
  this.nominaForm.get(['fechaini']).disable();
  this.nominaForm.get(['fechafin']).disable();
  this.init();
  }
  regresar() {
  this.router.navigate(['proyectos']);
}
init(){
  this._user.cargarUsuarios().subscribe(usuarios => {
    this.usuarios =[];
    usuarios.filter(usuario => {
    if(this.userLog.rol == 'Aprobador' && usuario['resp_asg'] === this.userLog.email ){
       this.usuarios.push(usuario)  }
       else if(this.userLog.rol == 'Administrador'){
        this.usuarios = usuarios;
      }
        })});
  this._pyt.cargarProyectos().subscribe((proyectos: Proyecto[]) => {
    this.proyectos =[];
    proyectos.filter(proyecto => {
      
     if(this.userLog.rol == 'Aprobador' && proyecto.resp_asg === this.userLog.email ){
      this.proyectos.push(proyecto)
     }       else if(this.userLog.rol == 'Administrador'){
      this.proyectos = proyectos;
    }
    
    })

  });
}


valor(nombre) {
  this.proyectos.filter(proyecto => {
    if (nombre === proyecto.nombre) {
      this.saldoDisp = proyecto.monto_d;
      this.proyecto = proyecto;
      this.nominaForm.get(['fechaini']).enable();
      this.nominaForm.get(['fechafin']).enable();
    }
  });
}

sueldoP() {
  this.nomina.salarioReal = this.nomina.salario * this.nomina.aumento;
  const saldoDia = Number(this.nomina.salarioReal) / 30;
  const dateIni = new Date(this.nomina.fechaini);
  const dateEnd = new Date(this.nomina.fechafin);
  const diferencia = dateEnd.getTime() - dateIni.getTime();
  const days = diferencia / (60 * 60 * 24 * 1000);
  this.saldoProyecto = saldoDia * (days + 1);
  this.nomina.costoProyecto = this.saldoProyecto;
}

}
