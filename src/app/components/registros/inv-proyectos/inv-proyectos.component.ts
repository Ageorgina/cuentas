import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { Proyecto } from '../../../general/model/proyecto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inv-proyectos',
  templateUrl: './inv-proyectos.component.html',
  styleUrls: ['./inv-proyectos.component.css']
})
export class InvProyectosComponent implements OnInit {
  titulo = 'Proyectos';
  headTitle = ['Nombre', 'Descripción', 'Duración', 'Monto Presupuestado', 'Monto Disponible', 'Tipo Proyecto',
              'ID Actividad', 'Proceso', 'Cliente', 'Responsable Cliente', 'Responsable ASG', 'Estatus', 'Modificar / Eliminar'];
  elements: Proyecto[] = [];
  boton = 'Guardar';

  // tslint:disable-next-line: variable-name
  constructor( private _proyS: ProyectosService , private router: Router) {

  }

  ngOnInit() {
    this._proyS.cargarProyectos().subscribe( (proyectos: Proyecto[]) => {
      this.elements = proyectos;
    });
  }
  borrar( value ) {
    this._proyS.cudProyectos().doc(value.id_proyecto).delete();
  }

  actualizar(value) {
    this.router.navigate(['registro-proyectos', `${value.id_proyecto}`]);
  }


  }


