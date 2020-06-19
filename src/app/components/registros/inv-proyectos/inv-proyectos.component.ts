import { Component, OnInit } from '@angular/core';
import { Proyecto, Gasto } from '../../../general/model';
import { Router } from '@angular/router';
import { AlertasService, GastosService, ProyectosService } from '../../../services';

@Component({
  selector: 'app-inv-proyectos',
  templateUrl: './inv-proyectos.component.html',
  styleUrls: ['./inv-proyectos.component.css']
})
export class InvProyectosComponent implements OnInit {
  titulo = 'Proyectos';
  headTitle = ['Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Monto Presupuestado',
               'Monto Disponible', 'Tipo Proyecto', 'Modificar'];
  subTh = ['ID Actividad', 'Proceso', 'Cliente', 'Responsable Cliente', 'Responsable ASG', 'Estatus'];
  elements: Proyecto[] = [];
  boton = 'Guardar';
  gastos: Gasto[] ;
  montoT: any ;
  // tslint:disable-next-line: variable-name
  mont_disp = 0 ;
  gastosxP = 0;
  proyectoName = '';
  loading = true;
  info: Proyecto;

  // tslint:disable-next-line: variable-name
  constructor( private _proyS: ProyectosService, private router: Router, private alert: AlertasService, private _gastos: GastosService) {
                this._proyS.cargarProyectos().subscribe( (proyectos: Proyecto[]) => {
                  this.elements = proyectos;
                  this.loading = false;
              });
            }

ngOnInit() {
  }

borrar( value ) {
  this.loading = true;
  this._proyS.cudProyectos().doc(value.id_proyecto).delete();
  this.alert.showSuccess();
  this.loading = false;
  }

actualizar(value) {
  this.loading = true;
  this.router.navigate(['registro-proyectos', `${value.id_proyecto}`]);
  }

  elementoSelected(value) {
      this.loading = false;
      this.router.navigate(['descripcion-proyecto', `${value.id_proyecto}`]);
  }

  
  }
