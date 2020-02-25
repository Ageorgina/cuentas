import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';

@Component({
  selector: 'app-inv-proyectos',
  templateUrl: './inv-proyectos.component.html',
  styleUrls: ['./inv-proyectos.component.css']
})
export class InvProyectosComponent implements OnInit {
  titulo = 'Proyectos';
  headTitle = ['Nombre', 'Descripción', 'Duración', 'Monto Presupuestado', 'Monto Disponible', 'Tipo Proyecto',
              'ID Actividad', 'Proceso', 'Cliente', 'Responsable Cliente', 'Responsable ASG', 'Estatus', 'Modificar / Eliminar'];
  elements = [];

  constructor( private _proyS: ProyectosService) {

  }

  ngOnInit() {
    this._proyS.cargarProyectos().subscribe( proyectos => {
      this.elements = proyectos;
    });
  }
  borrar() {
    console.log('se elimino');
  }

  actualizar() {
    console.log('se actualizo');
  }

  }


