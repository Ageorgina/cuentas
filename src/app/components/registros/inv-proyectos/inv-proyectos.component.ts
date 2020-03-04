import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { Proyecto } from '../../../general/model/proyecto';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { GastosService } from '../../../services/gastos.service';
import { Gasto } from '../../../general/model/gasto';
import { element } from 'protractor';

@Component({
  selector: 'app-inv-proyectos',
  templateUrl: './inv-proyectos.component.html',
  styleUrls: ['./inv-proyectos.component.css']
})
export class InvProyectosComponent implements OnInit {
  titulo = 'Proyectos';
  headTitle = ['Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Monto Presupuestado', 'Monto Disponible', 'Tipo Proyecto',
              'ID Actividad', 'Proceso', 'Cliente', 'Responsable Cliente', 'Responsable ASG', 'Estatus', 'Modificar / Eliminar'];
  elements: Proyecto[] = [];
  boton = 'Guardar';
  gastos: Gasto[];
  montoT: any ;
  // tslint:disable-next-line: variable-name
  mont_disp = 0 ;
  gastosxP = 0;
  proyectoName = '';
  loading = true;

  // tslint:disable-next-line: variable-name
  constructor( private _proyS: ProyectosService,
               private router: Router,
               private alert: AlertasService,
               // tslint:disable-next-line: variable-name
               private _gastos: GastosService) {
                // tslint:disable-next-line: deprecation
                this._proyS.cargarProyectos().subscribe( (proyectos: Proyecto[]) => {
                  this.elements = proyectos;
                  // tslint:disable-next-line: forin
                  for (const item in this.elements) {
                    this.elements[item].gastos = 0;
                  }
                  this.restarAlgo();
              });
            }

ngOnInit()    {

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

  private restarAlgo() {
    this.elements.filter( data => {
    //  this.mont_disp = data.monto_d - this.gastosxP;
    });

    this._gastos.cargarGastos().subscribe( (gastos: Gasto[]) => {
       this.gastos = gastos;
       this.gastos.filter( data => {
          // tslint:disable-next-line: forin
          for (const item in this.elements) {
             this.proyectoName = this.elements[item].tipo_proyecto;
             if (data.proyecto === this.proyectoName) {
               this.elements[item].gastos +=  Number(data.cantidad);
             }
             this.elements[item].monto_d = this.elements[item].monto_p - this.elements[item].gastos;
             this.loading = false;
          }
    });
   });

  }

  }


