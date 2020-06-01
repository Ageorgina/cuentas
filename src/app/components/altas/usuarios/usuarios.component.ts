import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Usuario, usuarioU } from '../../../general/model/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { AlertasService } from '../../../services/srv_shared/alertas.service';
import { Area } from '../../../general/model/area';
import { AreasService } from '../../../services/areas.service';
import { UserBase } from '../../../security/model/UserBase';
import { AuthService } from '../../../security/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ArchivosService } from '../../../services/archivos.service';
import { FileItem } from '../../../general/model/file-item';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  // tslint:disable-next-line:new-parens
  userSrv = new UserBase();
  titulo = 'Registrar Usuarios ASG';
  usuario: Usuario = new Usuario();
  usuarios: Usuario[];
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
  regresa: string = '';
  creador: string;
  activado: boolean;
  aprobador: boolean;
  uploadPercent: Observable<number>;
  urlImg: Observable<string>;
  archivos: FileItem[] = [];
  imgUser: any;
  // tslint:disable-next-line: variable-name
  constructor( private _userS: UsuariosService , private _areaS: AreasService, private formBuilder: FormBuilder,
               private active: ActivatedRoute, private router: Router, private utils: Utils,
               private auth: AuthService, public alert: AlertasService, private storage: AngularFireStorage , 
               private files: ArchivosService) {
                this.userForm = this.formBuilder.group({
                  nombre: ['', Validators.required],
                  ap_p: ['', Validators.required],
                  ap_m: ['', Validators.required],
                  correo: ['', [Validators.required, Validators.email]],
                  password: ['', Validators.required],
                  area: ['', Validators.required],
                  resp_asg: ['', Validators.required],
                  puesto: ['', Validators.required],
                  rol: [''],
                  activo: [''],
                  resp_area: ['']
                });
                this.usuarioLocal = JSON.parse(localStorage.getItem('currentUser'));
                this._areaS.cargarAreas().subscribe((areas: Area[]) => { this.areas = areas;  });
                this._userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
                  this.usuarios = [];
                  usuarios.filter(responsable => {
                    if (responsable.correo === this.usuarioLocal.usuario.username) {
                      this.loading = false;
                      this.resp = responsable;
                      this.admin = this.resp['rol'] === 'Administrador';
                      this.aprobador = responsable['rol'] === 'Aprobador';
                      this.tesorero = responsable['rol'] === 'Tesorero';
                    }
                    if (responsable.resp_area === true) {
                      this.loading = false;
                      this.usuarios.push(responsable);
                       }
                  });
                });
                this.id_user = this.active.snapshot.paramMap.get('id_user');
                if (this.id_user) {
                  this.userForm.controls['correo'].disable();
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
                    this.sameU = this.usuarioLocal.usuario.username === this.updateU['correo'];
                    this.activado = this.updateU.activo;
                  });
                  }

      }

  ngOnInit() {
  }

  get fval() {
    return this.userForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // ERROR
    if (!this.userForm.valid) {
      this.alert.formInvalid();
      this.loading = false;
      return ;
  }  // Actualizar correcto
    if (this.id_user && this.userForm.valid) {
      this.loading = false;
      this.usuario = this.userForm.value;
      this.actualizarDatos();
  }
  // Crear correcto
    if (!this.id_user && this.userForm.valid) {
    this.submitted = false;
    this.usuario = this.userForm.value;
    this.userSrv.usuario.username = this.usuario.correo;
    this.userSrv.usuario.email = this.usuario.correo;
    this.userSrv.usuario.correoPrincipal = this.usuario.correo;
    this.userSrv.usuario.santo = this.usuario.password;
    if (this.aprobador) {
      this.usuario.rol = 'Usuario';
    }
    this.usuario['activo'] = true;
    this._userS.crearUsuarioS(this.userSrv).subscribe( () => {
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
              imagen: 'https://firebasestorage.googleapis.com/v0/b/gastos-asg.appspot.com/o/usuarios%2Fusuario.png?alt=media&token=4749c4e5-9da8-42ef-ae5e-ddef8fefe95f'
            });
            this.alert.showSuccess();
            this.loading = false;
            this.limpiar();
          }
        });
      });
    }, error => {
      this.loading = false;
      this.alert.serverError();
    } );
}
}

 actualizarDatos() {
   this.loading = true;
   if ( this.sameU && this.fval['password'].touched) {
    this._userS.actualizar(this.uCargar()).subscribe(() => {
    this.usuario['id_user'] = this.id_user;
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
    const tittle = 'Su cambio contraseña fue exitoso, se reinicio su sesión';
    const timer = 2000;
    this.alert.tittleS = tittle;
    this.alert.timer = timer;
    this.alert.showSuccess();
    this.regresa = 'exito';
    this.loading = true;
    this.auth.logout();
    this.submitted = false;
    }, () => {
      this.loading = false;
      this.alert.serverError();
    });
  }
   if (this.userForm.valid && this.fval['password'].untouched) {

     this._userS.actualizar(this.uCargar()).subscribe(() => {
     this.usuario['id_user'] = this.id_user;
     this.usuario['id_user'] = this.id_user;
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
     this.regresar();
     return ;
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

  checkLetras($event: KeyboardEvent) {
    this.utils.letras($event);
  }

  checkNumeros($event: KeyboardEvent) {
    this.utils.numeros($event);
  }
  limpiar() {
    this.loading = false;
    this.userForm.reset();
    this.userForm.get(['resp_area']).reset('');
    this.userForm.get(['resp_asg']).setValue('');
    this.userForm.get(['area']).setValue('');
  }

  regresar() {
    this.router.navigate(['usuarios']);
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
  const id = this.usuarioLocal['usuario'].username;
  let algo: any = await new Promise((resolve, reject) => {
    this.files.CARPETA_FILES = 'usuarios';
    this.archivos[0].id = this.usuarioLocal['usuario'].username;
    this.files.cargarArchivosFb( this.archivos).finally(() => { resolve(
       this.archivos); })
     .catch(() => reject([]));
   });
}

}
