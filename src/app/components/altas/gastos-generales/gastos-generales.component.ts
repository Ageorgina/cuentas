import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { GastosService } from '../../../services/gastos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Oficina } from '../../../general/model/oficina';

@Component({
  selector: 'app-gastos-generales',
  templateUrl: './gastos-generales.component.html',
  styleUrls: ['./gastos-generales.component.css']
})
export class GastosGeneralesComponent implements OnInit {
  exito: boolean ;
  buttonText = 'Guardar';
  usuarios =  [];
  proyectos = [];
  gastosForm: FormGroup;
  gasto = Oficina;
  fecha : string;

  constructor( private formBuilder: FormBuilder,
               // tslint:disable-next-line: variable-name
               private _user: UsuariosService,
               // tslint:disable-next-line: variable-name
               private _pyt: ProyectosService,
               // tslint:disable-next-line: variable-name
               private _gst: GastosService) {

    this._user.cargarUsuarios().subscribe(usuarios => {

       this.usuarios = usuarios;
    });
    this._pyt.cargarProyectos().subscribe(proyectos => {
      this.proyectos = proyectos;
   });
  }

  ngOnInit() {

      this.gastosForm = this.formBuilder.group({

        resp_asg: ['', Validators.required],
        fecha: ['', Validators.required],
        cantidad: ['', Validators.required],
        motivo: ['', Validators.required],
        tipo_gasto: ['', Validators.required],
        proyecto: ['', Validators.required],
        estatus: ['', Validators.required],
    });
  }
  onSubmit() {
    this.gasto = this.gastosForm.value;
    this.fecha = this.gastosForm.value.fecha;
    console.log(this.fecha);
    this._gst.cudGastos().add(this.gasto);
  }

}
