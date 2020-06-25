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
  usuarioLocal: any;
  usuariosConsulta: any[];
  userU = new usuarioU();
  id: any;
  resp: any;
  sameU: boolean;
  admin: boolean;
  tesorero: boolean;
  regresa = '';
  creador: string;
  activado: boolean;
  aprobador: boolean;
  uploadPercent: Observable<number>;
  urlImg: Observable<string>;
  archivos: FileItem[] = [];
  imgUser: any;
  imagen = this.usuario.imagen;
  pass: any;
    // tslint:disable-next-line: variable-name
  id_usuario = "0";
  rolU: boolean;
  financiero: boolean;
  userCreate: any = UserBase;

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
                 this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                 this._userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                 usuarios.filter(responsable => {
                   if (responsable.correo === this.usuarioLocal.usuario.username) {
                     this.loading = false;
                     this.resp = responsable;
                     this.admin = this.resp.rol === 'Administrador';
                     this.aprobador = this.resp.rol === 'Aprobador';
                     this.tesorero = this.resp.rol === 'Tesorero';
                     this.financiero = this.resp.rol === 'Financiero';
                     this.rolU = this.resp.rol === 'Usuario';
                   }
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
                   this.sameU = this.usuarioLocal.usuario.username === this.updateU.correo;
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
    this.usuario.creado = this.resp.correo;
    if (!this.userForm.valid || (this.fval.rol.value === 'Rol' || this.fval.area.value  === 'Área' ||
       this.fval.resp_asg.value === 'Jefe inmediato' || this.fval.puesto.value === '') && !this.tesorero) {
      this.alert.formInvalid();
      this.loading = false;
      return ;
  }  else {
    if (!this.id_user) {
      this.createUser();
    } else {
      if (this.archivos.length >= 1) {
        this.archivos.filter( data => {
          if (data.url !== 'NO TIENE URL') {
            this.usuario.imagen = this.archivos[0].url;
          }
          });
        }
        this._userS.actualizar(this.uCargar()).subscribe(() => {
          this.usuario.id_user = this.id_user;
      this._userS.cudUsuarios().doc(this.id_user).update(this.usuario).finally(() => {
        this.loading = false;
        this.alert.showSuccess();
        this.auth.update = true;
        this.regresar();
        this.auth.login(this.usuarioLocal.correo, this.usuarioLocal.password);
      }); 
    }, () => {
      this.alert.showError();
    });
    }
  }
  }


  createUser() {
    this.userSrv.usuario.username = this.usuario.correo;
    this.userSrv.usuario.email = this.usuario.correo;
    this.userSrv.usuario.correoPrincipal = this.usuario.correo;
    this.userSrv.usuario.santo = this.usuario.password;
    this.usuario['activo'] = true;
    this.usuario.imagen = this.imagen;
    if (this.tesorero) {
      this.usuario.rol = 'Usuario';
    }
    this._userS.crearUsuarioS(this.userSrv).subscribe(  resp => {
      if (resp.resultado.error) {
        this.loading = false;
        this.alert.textError = 'El correo ya existe';
        this.alert.showError();
      }  else {
        this.searchUser();
      }
  });
  }

  checkLetras($event: KeyboardEvent) { this.utils.letras($event); }
  checkNumeros($event: KeyboardEvent) {  this.utils.numeros($event); }

  uCargar() {
    this.userU.usuario = {
     idUsuario: this.updateU.idUsuario,
      username: this.updateU.correo,
      email: this.updateU.correo,
      passOld: this.updateU.password,
      passNew: this.usuario.password
    };
    return this.userU;
  }
async avatar(event) {
  this.imgUser = new FileItem(event.target.files[0]);
  this.archivos.push(this.imgUser);
  const id = this.usuarioLocal.usuario.username;
  const algo: any = await new Promise((resolve, reject) => {
    this.files.CARPETA_FILES = 'usuarios';
    this.archivos[0].id = this.usuarioLocal.usuario.username;
    this.files.cargarArchivosFb( this.archivos).finally(() => { resolve(
       this.archivos); })
     .catch(() => reject([]));
   });
}

async searchUser() {
  this._userS.consultaUsuarios().subscribe( usuarios => {
    const users: any[] = usuarios['resultado'].usuarios;
    users.filter(usuario => {
      if (usuario['username'] === this.usuario['correo']) {
        this.usuario.idUsuario = usuario['id'];
        this.createUserFB();
      }
    });
  }, () => {
    this.loading = false;
    this.alert.serverError();
  });
}

createUserFB() {
  this._userS.cudUsuarios().add(this.usuario).finally(() => {
    this.limpiar();
  });
}

    cambio(event) {  this.pass = event; }
    
    limpiar() {
      this.loading = false;
      this.submitted = false;
      this.userForm.reset();
      this.userForm.get(['rol']).setValue('Rol');
      this.userForm.get(['resp_asg']).setValue('Jefe inmediato');
      this.userForm.get(['area']).setValue('Área');
      this.auth.activo = true;
      this.auth.login(this.usuarioLocal.correo, this.usuarioLocal.password);
    }
    regresar() {
      this.router.navigate(['usuarios']);
    }

    asignar() {
      this.id_usuario = this.id_user;
    }
  }
                /*

                this._areaS.cargarAreas().subscribe((areas: Area[]) => { this.areas = areas;  });
                this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                this._userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                  usuarios.filter(responsable => {
                    if (responsable.correo === this.usuarioLocal.usuario.username) {
                      this.loading = false;
                      this.resp = responsable;
                      this.admin = this.resp.rol === 'Administrador';
                      this.aprobador = this.resp.rol === 'Aprobador';
                      this.tesorero = this.resp.rol === 'Tesorero';
                    }
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
                    this.sameU = this.usuarioLocal.usuario.username === this.updateU.correo;
                    this.activado = this.updateU.activo;
                  });
                  }
                  this.userForm.get(['rol']).setValue('Rol');
                  this.userForm.get(['resp_asg']).setValue('Jefe inmediato');
                  this.userForm.get(['area']).setValue('Área');
      }


  get fval() {
    return this.userForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.usuario = this.userForm.value;

  // ERROR
// Actualizar correcto
    if (this.id_user && this.userForm.valid) {
      this.loading = false;
      this.actualizarDatos();
  }

  // Crear correcto
  if (!this.id_user && this.userForm.valid) {
    if (this.tesorero ) {
      this.usuario.rol = 'Usuario';
    }
    this.submitted = false;
    this.userSrv.usuario.username = this.usuario.correo;
    this.userSrv.usuario.email = this.usuario.correo;
    this.userSrv.usuario.correoPrincipal = this.usuario.correo;
    this.userSrv.usuario.santo = this.usuario.password;
    this.usuario['activo'] = true;
    this._userS.crearUsuarioS(this.userSrv).subscribe(  resp => {
      if(resp.resultado.error){
        this.loading = false;
        this.alert.textError = resp.resultado.error;
        this.alert.showError();
      }
      this._userS.consultaUsuarios().subscribe( usuarios => {
        const users: any[] = usuarios['resultado'].usuarios;
        users.filter(usuario => {
          if (usuario['username'] === this.usuario['correo']) {
            this.usuario['idUsuario'] = usuario['id'];
            this._userS.cudUsuarios().add({
              idUsuario: usuario['id'],
              nombre: this.usuario['nombre'],
              ap_p: this.usuario['ap_p'],
              ap_m: this.usuario['ap_m'],
              correo: this.usuario['correo'],
              password: this.usuario['password'],
              puesto: this.usuario['puesto'],
              resp_asg: this.usuario['resp_asg'],
              area: this.usuario['area'],
              id_user: '',
              resp_area: this.usuario['resp_area'],
              rol: this.usuario['rol'],
              activo: this.usuario['activo'],
              imagen: this.imagen
            });
            this.alert.showSuccess();
            this.loading = false;
            this.limpiar();
          }
        });
      });
    }, () => {
      this.loading = false;
      this.alert.serverError();
    } );
}
}

 actualizarDatos() {
   this.loading = true;
   if ( this.sameU && this.pass !== undefined ) {
    this._userS.actualizar(this.uCargar()).subscribe(() => {
    this.usuario.id_user = this.id_user;
    if (this.archivos.length >= 1) {
      this.archivos.filter( data => {
        if (data.url !== 'NO TIENE URL') {
          this.usuario.imagen = this.archivos[0].url;
        }
        });
    } else {
      this.usuario.imagen = this.updateU.imagen;
    }
    this._userS.cudUsuarios().doc(this.id_user).update(this.usuario);
    this.loading = false;
    const tittle = 'Su cambio contraseña fue exitoso';
    const timer = 2000;
    this.alert.tittleS = tittle;
    this.alert.timer = timer;
    this.alert.showSuccess();
    this.submitted = false;
    this.router.navigate(['usuarios']);
    this.pass = undefined;
    return;
    }, () => {
      this.loading = false;
      this.alert.serverError();
    });
  }
  if (this.userForm.valid && this.pass === undefined) {
    this._userS.actualizar(this.uCargar()).subscribe(() => {
     this.usuario.id_user = this.id_user;
     this.usuario.id_user = this.id_user;
     if (this.archivos.length >= 1) {
       this.archivos.filter( data => {
         if (data.url !== 'NO TIENE URL') {
           this.usuario.imagen = this.archivos[0].url;
         }
         });
     } else {
       this.usuario.imagen = this.updateU.imagen;
     }
     this._userS.cudUsuarios().doc(this.id_user).update(this.usuario);
     this.alert.showSuccess();
     this.loading = false;
     this.router.navigate(['usuarios']);
    }, () => {
    this.loading = false;
    this.alert.serverError();
  }, () => {
      this.submitted = false;
      this.alert.showSuccess();
      this.loading = false;
      }
    );
}
   if (!this.userForm.valid) {
  this.loading = false;
  this.alert.formInvalid();
}
}

  uCargar() {
    this.userU.usuario = {
     idUsuario: this.updateU.idUsuario,
      username: this.updateU.correo,
      email: this.updateU.correo,
      passOld: this.updateU.password,
      passNew: this.usuario.password
  };
    return this.userU;
}
async avatar(event) {
  this.imgUser = new FileItem(event.target.files[0]);
  this.archivos.push(this.imgUser);
  const id = this.usuarioLocal.usuario.username;
  const algo: any = await new Promise((resolve, reject) => {
    this.files.CARPETA_FILES = 'usuarios';
    this.archivos[0].id = this.usuarioLocal.usuario.username;
    this.files.cargarArchivosFb( this.archivos).finally(() => { resolve(
       this.archivos); })
     .catch(() => reject([]));
   });
}


}*/
