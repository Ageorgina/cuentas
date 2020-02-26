import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { ProyectosService } from '../../../services/proyectos.service';
import { GastosService } from '../../../services/gastos.service';
import { ClientesService } from '../../../services/clientes.service';
import { Proyecto } from '../../../general/model/proyecto';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  titulo = 'Proyecto';
  usuarios =  [];
  clientes = [];
  proyectosForm: FormGroup;
  proyecto = Proyecto;
  gastos = [];
  // tslint:disable-next-line: variable-name
  monto_d: number;

  constructor( private formBuilder: FormBuilder,
               // tslint:disable-next-line: variable-name
               private _user: UsuariosService,
               // tslint:disable-next-line: variable-name
               private _pyt: ProyectosService,
               // tslint:disable-next-line: variable-name
               private _gst: GastosService,
               // tslint:disable-next-line: variable-name
               private _cte: ClientesService,
               ) {

    this._user.cargarUsuarios().subscribe(usuarios => {
       console.log(usuarios);
       this.usuarios = usuarios;
    });
    this._cte.cargarClientes().subscribe(cts => {
    console.log(cts);
    this.clientes = cts;
  });
    this._gst.cargarGastos().subscribe(gastos => {
    console.log(gastos);
    this.gastos = gastos;
  });
  }

  ngOnInit() {

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
  }
  onSubmit() {
    this.proyecto = this.proyectosForm.value;
    this.monto_d = this.proyectosForm.value.monto_p; // pediente
    this.proyectosForm.value.monto_d = this.monto_d;
    this._pyt.cudProyectos().add(this.proyecto);

  }

}
