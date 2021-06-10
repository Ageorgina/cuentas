import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { AlertasService, AreasService, ArchivosService, UsuariosService } from '../../../services';
import { FileItem, Usuario, usuarioU, Area } from '../../../general/model';
import { UserBase } from '../../../security/model/UserBase';
import { AuthService } from '../../../security/services/auth.service';
import { Cuenta } from '../../../general/model/cuenta';
import { Clave } from '../../../general/model/clave';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{
  userSrv = new UserBase();
  titulo = 'Registrar Usuarios ASG';
  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  area= new Area;
  areas: any = [];
  userLog = JSON.parse(sessionStorage.getItem('currentUser'))
  loading = true;
  userForm: FormGroup;
  boton = 'Guardar';
  updateU= new Usuario;
  // tslint:disable-next-line: variable-name
  id_user: any;
  idUsuario: number;
  textError: string;
  submitted = false;
  actualizar = false;
  usuarioActual: any;
  usuariosConsulta: any[];
  userU = new usuarioU();
  id: any;
  resp: any;
  same = false;
  admin: boolean;
  activo: boolean;
  rolU: boolean;
  aprobador: boolean;
  financiero: boolean;
  regresa = '';
  creador: string;
  activado: boolean;
  uploadPercent: Observable<number>;
  urlImg: Observable<string>;
  archivos: FileItem[] = [];
  imgUser: any;
  imagen = this.usuario.imagen;
  pass: any;
  userCreated: any = UserBase;
  cuenta: any;
  tesorero = false;
  notification = new Clave;

  // tslint:disable-next-line: variable-name
  constructor( private _userS: UsuariosService , private _areaS: AreasService, private formBuilder: FormBuilder, private utils: Utils,
               private auth: AuthService, private active: ActivatedRoute, private router: Router, public alert: AlertasService,
               private files: ArchivosService) {
                this._areaS.cargarAreas().subscribe(areas => this.areas = areas);
                this.getLider();
                this.id_user = this.active.snapshot.paramMap.get('id_user');
                 this.userForm = this.formBuilder.group({
                  nombre: ['', Validators.required],
                  ap_p: ['', Validators.required],
                  ap_m: ['', Validators.required],
                  correo: ['', [Validators.required, Validators.email]],
                  password: ['', Validators.required],
                  area: ['Área'],
                  resp_asg: ['Jefe inmediato'],
                  puesto: [''],
                  rol: ['Rol'],
                  activo: [true],
                  resp_area: [false],
                  imagen: [''],
                  banco:[''],
                  clave:['', Validators.minLength(18)]
                });
                if(this.userLog.rol == 'Tesorero' && (this.id_user == undefined || this.id_user == null)){
                  this.tesorero = true;
                  this.userForm.get(['area']).disable();
                  this.userForm.get(['resp_asg']).disable();
                  this.userForm.get(['rol']).disable();
                  this.userForm.get(['resp_area']).disable();
                  this.userForm.get(['puesto']).disable();
                }
                 if ( this.id_user !== null) {
                 this.userForm.controls.correo.disable();

                 this.titulo = 'Modificar Usuario ASG';
                 this.actualizar = true;
                 this._userS.cudUsuarios().doc(this.id_user).valueChanges().subscribe((upusuario: Usuario) => {
                   this.updateU = upusuario;
                   this._userS.cargarCuentas().subscribe(response=> {
                     this.cuenta  = response.find(usuario => usuario['correo'] === upusuario.correo);
                     if(this.cuenta !== undefined){
                      this.userForm.get(['banco']).setValue(this.cuenta['banco'].toUpperCase())
                    this.userForm.get(['clave']).setValue(this.cuenta['clave']);
                     }                    

                   this.userForm.get(['nombre']).setValue(this.updateU.nombre);
                   this.userForm.get(['ap_p']).setValue(this.updateU.ap_p);
                   this.userForm.get(['ap_m']).setValue(this.updateU.ap_m);
                   this.userForm.get(['correo']).setValue(this.updateU.correo);
                   this.userForm.get(['password']).setValue(this.updateU.password);
                   this.userForm.get(['resp_area']).setValue(this.updateU.resp_area);
                   this.userForm.get(['resp_asg']).setValue(this.updateU.resp_asg);
                   this.userForm.get(['area']).setValue(this.updateU.area);
                   this.userForm.get(['puesto']).setValue(this.updateU.puesto);
                   this.userForm.get(['rol']).setValue(this.updateU.rol);
                   this.userForm.get(['activo']).setValue(this.updateU.activo);
                   this.userForm.get(['imagen']).setValue(this.updateU.imagen);
                   this.same = this.userLog['email'] === this.updateU.correo;
                   this.activado = this.updateU.activo;
                   this.loading = false;
                });
                 });
                 }
               }
  get fval() { return this.userForm.controls; }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    if(this.userLog.rol !== 'Tesorero'){
      if (this.fval.rol.value == 'Rol' ) {
        this.userForm.get(['rol']).setErrors({required: true});
      }
      if (this.fval.area.value == 'Área' ) {
        this.userForm.get(['area']).setErrors({required: true});
      }
      if (this.fval.resp_asg.value == 'Jefe inmediato') {
        this.userForm.get(['resp_asg']).setErrors({required: true});
      }
      if (this.fval.puesto.value == '') {
        this.userForm.get(['puesto']).setErrors({required: true});
      }
    }
    this.usuario = this.userForm.value;

    if (this.userForm.invalid === true ) {
          this.alert.formInvalid();
          this.loading = false;
          return ;
    } else if ( this.id_user === null || this.id_user === undefined) {
      this.createUser();
    } else if ( this.id_user !== null) {
      this.usuario = this.userForm.value;
      this.usuario.id_user = this.id_user;
      if (this.archivos.length >= 1) {
        this.archivos.filter( data => {
          if (data.url !== 'NO TIENE URL') {
            this.usuario.imagen = this.archivos[0].url;
          }
          });
        }

        if(this.cuenta === undefined){ 

          this.cuenta = new Cuenta;
          this.cuenta.ap_p = this.usuario.ap_p;
          this.cuenta.ap_m = this.usuario.ap_m;
          this.cuenta.nombre= this.usuario.nombre;
          this.cuenta.banco= this.fval.banco.value;
          this.cuenta.clave= this.fval.clave.value;
          this.cuenta.correo= this.updateU.correo;
          this.cuenta.createby= this.userLog.email;
          this._userS.cudCuentas().add({...this.cuenta}).then(()=> {
            this.updateUser();
          }).catch(()=>{
            this.loading  = false;
            this.alert.showError();
          });
        } else {
          this.cuenta['ap_p'] = this.usuario.ap_p;
          this.cuenta['ap_m'] = this.usuario.ap_m;
          this.cuenta['nombre'] = this.usuario.nombre;
          this.cuenta['banco'] = this.fval.banco.value;
          this.cuenta['clave'] = this.fval.clave.value;
          this.cuenta['correo'] = this.updateU.correo;
          this._userS.cudCuentas().doc(this.cuenta.id_cuenta).update({...this.cuenta}).then(()=>{
            this.updateUser();
          }).catch(()=>{
            this.loading  = false;
            this.alert.showError();
          });
        }

    }
  }

createUser() {
  this.usuario = this.userForm.value;
  this.userSrv.usuario.username = this.fval.correo.value;
  this.userSrv.usuario.email = this.fval.correo.value;
  this.userSrv.usuario.correoPrincipal = this.fval.correo.value;
  this.userSrv.usuario.santo = this.fval.password.value;
  this.usuario.activo = true;
  this.usuario.imagen = this.imagen;
  this._userS.crearUsuarioS(this.userSrv).subscribe(  resp => {
    this.usuario.createdby = this.userLog.email;
    if (resp.resultado.error) {
      this.loading = false;
      this.alert.textError = 'El correo ya existe';
      this.alert.showError();
      return;
    }  else {
      this.usuario.idUsuario = resp.resultado.id;
      if (this.userLog.rol === 'Tesorero' && ( this.id_user === null)) {
        this.usuario.rol = 'Usuario';
        this.usuario.resp_asg = 'administrador@asgbpm.com';
        this.usuario.puesto = 'Default';
        this.usuario.area = 'Administración';
        this.usuario.resp_area = false;
      }
      
      this._userS.cudUsuarios().add(this.usuario).finally( () => {
        this.alert.showSuccess();
        this.getLider();
        this.limpiar();

      });
    }
});
}

async avatar(event) {
  this.imgUser = new FileItem(event.target.files[0]);
  this.archivos.push(this.imgUser);
  const id = this.usuarioActual.respuesta.usuario.username;
  const algo: any = await new Promise((resolve, reject) => {
    this.files.CARPETA_FILES = 'usuarios';
    this.archivos[0].id = this.usuarioActual.respuesta.usuario.username;
    this.files.cargarArchivosFb( this.archivos).finally(() => { resolve(
       this.archivos); })
     .catch(() => reject([]));
   });
}

updateUser() {
  this._userS.actualizar(this.userUpdateDB()).toPromise().then( () => {
    this.usuario.idUsuario = this.updateU.idUsuario;
    this._userS.cudUsuarios().doc(this.usuario.id_user).update(this.usuario).then(() => {

      if (this.same === true) {
        this.auth.logout();
        this.alert.changeInfoSuccess();
      } else {
          this.loading = false;
          this.regresar();
          this.alert.showSuccess();
      }
      }).catch(()=>{
        this.loading = false;
        this.alert.textError = 'Error del servidor';
        this.alert.showError();
      });
    }).catch(() => {
      this.loading = false;
      this.alert.textError = 'Error del servidor';
      this.alert.showError();
    });
}
ngOnInit(){
  this.loading = false;
}

userUpdateDB() {
  this.userU.usuario = {
   idUsuario: this.updateU.idUsuario,
    username: this.updateU.correo,
    email: this.updateU.correo,
    passOld: this.updateU.password,
    passNew: this.usuario.password
  };
  return this.userU;
}

limpiar() {
  this.loading = false;
  this.submitted = false;
  this.userForm.reset();
  this.userForm.get(['rol']).setValue('Rol');
  this.userForm.get(['resp_asg']).setValue('Jefe inmediato');
  this.userForm.get(['area']).setValue('Área');
  
}

regresar() {
  this.router.navigate(['usuarios']);
}

checkLetras($event: KeyboardEvent) { this.utils.letras($event); }
checkNumeros($event: KeyboardEvent) {  this.utils.numeros($event); }
getLider(){
  this.usuarios = [];
  this._userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
    usuarios.filter(responsable => {
      if (responsable.resp_area === true) {
        this.usuarios.push(responsable);
         }
    });
  });
}


}
