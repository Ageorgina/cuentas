import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { GastosService } from '../../../services/gastos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto } from '../../../general/model/gasto';
import { Usuario } from '../../../general/model/usuario';
import { Proyecto } from '../../../general/model/proyecto';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor( private formBuilder: FormBuilder,
               // tslint:disable-next-line: variable-name
               private _user: UsuariosService,
               // tslint:disable-next-line: variable-name
               private _pyt: ProyectosService,
               // tslint:disable-next-line: variable-name
               private __gastoS: GastosService,
               private active: ActivatedRoute,
               private router: Router
               ) {
    this._user.cargarUsuarios().subscribe((usuarios: Usuario[]) => { this.usuarios = usuarios; });
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
      this.boton = 'Actualizar';
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

  }

  onSubmit() {
    if (this.id_gasto) {
      this.gasto = this.gastosForm.value;
      this.__gastoS.cudGastos().doc(this.id_gasto).update(this.gasto);
      this.router.navigate(['gastos']);
      } else {
    this.gasto = this.gastosForm.value;
    this.fecha = this.gastosForm.value.fecha;
    this.__gastoS.cudGastos().add(this.gasto);
  }
}

}
