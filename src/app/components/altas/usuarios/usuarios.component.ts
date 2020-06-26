import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { AlertasService, AreasService, ArchivosService, UsuariosService } from '../../../services';
import { FileItem, Usuario, usuarioU, Area } from '../../../general/model';
import { UserBase } from '../../../security/model/UserBase';
import { AuthService } from '../../../security/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  userSrv = new UserBase();
  titulo = 'Registrar Usuarios ASG';
  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  area: Area;
  areas: Area[];
  loading = true;
  userForm: FormGroup;
  boton = 'Guardar';
  updateU: Usuario;
  // tslint:disable-next-line: variable-name
  id_user: string;
  idUsuario: number;
  textError: string;
  submitted = false;
  actualizar = false;
  usuarioActual: any;
  usuariosConsulta: any[];
  userU = new usuarioU();
  id: any;
  resp: any;
  sameU = false;
  admin: boolean;
  tesorero: boolean;
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

  // tslint:disable-next-line: variable-name
  constructor( private _userS: UsuariosService , private _areaS: AreasService, private formBuilder: FormBuilder, private utils: Utils,
               private auth: AuthService, private active: ActivatedRoute, private router: Router, public alert: AlertasService,
               private files: ArchivosService) {
                 this.loading = false;
                 this.userForm = this.formBuilder.group({
                  nombre: ['', Validators.required],
                  ap_p: ['', Validators.required],
                  ap_m: ['', Validators.required],
                  correo: ['', [Validators.required, Validators.email]],
                  password: ['', Validators.required],
                  area: [''],
                  resp_asg: [''],
                  puesto: [''],
                  rol: [''],
                  activo: [''],
                  resp_area: [''],
                  imagen: ['']
                });
                 this.userForm.get(['rol']).setValue('Rol');
                 this.userForm.get(['resp_asg']).setValue('Jefe inmediato');
                 this.userForm.get(['area']).setValue('Área');
                 this._areaS.cargarAreas().subscribe((areas: Area[]) => { this.areas = areas;  });
                 this.usuarioActual = this.auth.userFb;
                 this.admin = this.auth.admin;
                 this.aprobador = this.auth.aprobador;
                 this.tesorero = this.auth.tesorero;
                 this.financiero = this.auth.financiero;
                 this.rolU = this.auth.rolU;
                 this._userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                 usuarios.filter(responsable => {
                   if (responsable.resp_area === true) {
                     this.loading = false;
                     this.usuarios.push(responsable);
                      }
                 });
               });
                 this.id_user = this.active.snapshot.paramMap.get('id_user');
                 if (this.id_user) {
                 this.userForm.controls.correo.disable();
                 this.loading = false;
                 this.titulo = 'Modificar Usuario ASG';
                 this.actualizar = true;
                 this._userS.cudUsuarios().doc(this.id_user).valueChanges().subscribe((upusuario: Usuario) => {
                   this.updateU = upusuario;
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
                   this.sameU = this.usuarioActual.correo === this.updateU.correo;
                   this.activado = this.updateU.activo;
                 });
                 }
               }
  get fval() { return this.userForm.controls; }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    this.loading = true;
    this.usuario = this.userForm.value;
    this.usuario.createdby = this.usuarioActual.correo;
    if (!this.userForm.valid || (this.fval.rol.value === 'Rol' || this.fval.area.value  === 'Área' ||
        this.fval.resp_asg.value === 'Jefe inmediato' || this.fval.puesto.value === '') && !this.tesorero) {
          this.alert.formInvalid();
          this.loading = false;
          return ;
    } else if (!this.id_user) {
      this.createUser();
    } else if (this.id_user) {
      this.usuario.id_user = this.id_user;
      if (this.archivos.length >= 1) {
        this.archivos.filter( data => {
          if (data.url !== 'NO TIENE URL') {
            this.usuario.imagen = this.archivos[0].url;
          }
          });
        }
     this.updateUser();
    }
  }

createUser() {
  this.userSrv.usuario.username = this.usuario.correo;
  this.userSrv.usuario.email = this.usuario.correo;
  this.userSrv.usuario.correoPrincipal = this.usuario.correo;
  this.userSrv.usuario.santo = this.usuario.password;
  this.usuario.activo = true;
  this.usuario.imagen = this.imagen;
  if (this.tesorero) {
    this.usuario.rol = 'Usuario';
    this.usuario.resp_asg = 'Default';
    this.usuario.puesto = 'Default';
    this.usuario.area = 'Default';
    this.id_user = '0';
    this.usuario.resp_area = false;
  }
  this._userS.crearUsuarioS(this.userSrv).subscribe(  resp => {
    if (resp.resultado.error) {
      this.loading = false;
      this.alert.textError = 'El correo ya existe';
      this.alert.showError();
    }  else {
      this.usuario.idUsuario = resp.resultado.id;
      this._userS.cudUsuarios().add(this.usuario).finally( () => {
        this.alert.showSuccess();
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
  this._userS.actualizar(this.userUpdateDB()).subscribe( () => {
    this._userS.cudUsuarios().doc(this.id_user).update(this.usuario).finally(() => {
      if (this.sameU) {
        this.auth.logout();
        this.alert.changeInfoSuccess();
      } else {
          this.loading = false;
          this.regresar();
          this.alert.showSuccess();
      }
      });
    });
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


}
