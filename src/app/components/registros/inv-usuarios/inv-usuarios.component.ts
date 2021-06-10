import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Usuario } from '../../../general/model';
import { Router,  } from '@angular/router';
import { UsuariosService } from '../../../services';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
@Component({
  selector: 'app-inv-usuarios',
  templateUrl: './inv-usuarios.component.html',
  styleUrls: ['./inv-usuarios.component.css']
})

export class InvUsuariosComponent implements OnInit, AfterViewInit {
  titulo = 'Usuarios ASG';
  headTitle = ['Nombre', 'Rol', 'Área', 'Jefe Inmediato', 'Correo', 'Puesto', 'Acciones'];
  elements = [];
  usuario = new Usuario;
  loading = true;
  userLog = JSON.parse(sessionStorage.getItem('currentUser'))
  cuentas =[];

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
 // elements: any = [];
  previous: any = [];


  // tslint:disable-next-line: variable-name
  constructor( private _user: UsuariosService , private cdRef: ChangeDetectorRef,
                 private router: Router) {
                  this._user.cargarCuentas().subscribe(response=>{this.cuentas = response;})

              }

ngOnInit() {

  this.loading = false;
  }

  ngAfterViewInit() {
    this.init();
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

borrar( value ) {
  value['activo'] = false;
  this._user.cudUsuarios().doc(value['id_user']).update(value);
  this.init();
  this.loading = false;
  }

actualizar(value) {
    this.router.navigate(['registro-usuarios', `${value.id_user}`]);
  }

  init(){
    this.elements = [];
    this._user.cargarUsuarios().subscribe( usuarios => {
      this.elements = [];
      if(this.userLog.rol === 'Usuario' || this.userLog.rol === 'Financiero'){
          this.elements.push(usuarios.find(user => user['correo'] === this.userLog.email))
      } else if (this.userLog.rol === 'Administrador') {
  
            usuarios.filter(usuario => {
              if(usuario['activo'] === true) {
                this.elements.push(usuario);
          }
        });
      } else {
            usuarios.filter(usuario => {
              if(usuario['resp_asg'] == this.userLog.email  && usuario['activo'] === true ){
                this.elements.push(usuario)
              }
        });
        this.elements.push(usuarios.find(user => user['correo'] === this.userLog.email))

      }
      

      this.mdbTable.setDataSource(this.elements);
      this.elements = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    });


  }
  

  }

