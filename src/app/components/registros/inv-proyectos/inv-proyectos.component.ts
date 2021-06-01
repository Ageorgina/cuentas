import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Proyecto, Gasto } from '../../../general/model';
import { Router } from '@angular/router';
import { AlertasService, GastosService, ProyectosService } from '../../../services';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
@Component({
  selector: 'app-inv-proyectos',
  templateUrl: './inv-proyectos.component.html',
  styleUrls: ['./inv-proyectos.component.css']
})
export class InvProyectosComponent implements OnInit, AfterViewInit {
  titulo = 'Proyectos';
  headTitle = ['Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Monto Presupuestado',
               'Monto Disponible', 'Tipo Proyecto', 'Acciones'];
  subTh = ['ID Actividad', 'Proceso', 'Cliente', 'Responsable Cliente', 'Responsable ASG', 'Estatus'];
  elements = [];
  boton = 'Guardar';
  gastos: Gasto[] ;
  userLog = JSON.parse(sessionStorage.getItem('currentUser'))
  montoT: any ;
  mont_disp = 0 ;
  gastosxP = 0;
  proyectoName = '';

  headElements = ['id', 'first', 'last', 'handle'];

  loading = true;
  info: Proyecto;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
 // elements: any = [];
  previous: any = [];


  // tslint:disable-next-line: variable-name
  constructor( private _proyS: ProyectosService, private cdRef: ChangeDetectorRef, private router: Router, private alert: AlertasService, private _gastos: GastosService) {
    this.init()
            }

ngOnInit() {
  }
  ngAfterViewInit() {

    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

borrar( value ) {
  this.elements = [];
  this.loading = true;
  this._proyS.cudProyectos().doc(value.id_proyecto).delete();
  this.alert.showSuccess();
  this.init();
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
  init(){
    this.elements = [];
    this._proyS.cargarProyectos().subscribe( proyectos => {

      if(this.userLog.rol === 'Aprobador'){
        proyectos .filter(proyecto => { 
          if(proyecto['resp_asg'] === this.userLog.email){
            this.elements.push(proyecto)
          }
        
      });
      }else {
        this.elements = proyectos;
      }


      this.mdbTable.setDataSource(this.elements);
      this.elements = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
      this.loading = false;
  });
  }

  
  }
