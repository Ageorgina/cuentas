import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { Proyecto } from '../../../general/model/proyecto';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { GastosService } from '../../../services/gastos.service';
import { Gasto } from '../../../general/model/gasto';

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
  gastosp: Gasto[];
  montoT: any ;
  // tslint:disable-next-line: variable-name
  mont_disp = 0 ;
  gastosxP: 0;
  proyectoName = '' ;

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
                      this.proyectoName = this.elements[item].tipo_proyecto;
                      console.log('proyectoName', this.proyectoName);
                }
              });
                // tslint:disable-next-line: deprecation
                this._gastos.cargarGastos().subscribe( (gastos: Gasto[]) => {
                  this.gastosp = gastos;
                  this.gastosp.filter( data => {
                    console.log(data.proyecto);
                    if (data.proyecto === this.proyectoName) {
                      // tslint:disable-next-line: forin
                      for (const item in this.gastosp) {
                        this.gastosxP +=  Number(this.gastosp[item].cantidad);
                        console.log('gastosxPfor', this.gastosp[item].cantidad);
                        console.log('gastosxP', this.gastosxP);
                      }
                    }
               });
              });
            }

ngOnInit()    {

  }
borrar( value ) {
    this._proyS.cudProyectos().doc(value.id_proyecto).delete();
    this.alert.showSuccess();
  }

actualizar(value) {
    this.router.navigate(['registro-proyectos', `${value.id_proyecto}`]);
  }


  }


