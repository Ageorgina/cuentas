import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Usuario } from '../../../general/model/usuario';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  titulo = 'Registrar Usuarios ASG';
  usuario: Usuario;
  userForm: FormGroup;
  boton = 'Guardar';
  updateU: Usuario;
  // tslint:disable-next-line: variable-name
  id_user: string;
  // tslint:disable-next-line: variable-name
  constructor( private _userS: UsuariosService ,
               private formBuilder: FormBuilder,
               private active: ActivatedRoute,
               private router: Router) {

                this.userForm = this.formBuilder.group({
                  nombre: ['', Validators.required],
                  puesto: ['', Validators.required]
                });

                this.id_user = this.active.snapshot.paramMap.get('id_user');
                console.log(this.id_user);
                if (this.id_user) {
                  this.titulo = 'Modificar Usuario ASG';
                  this.boton = 'Actualizar';
                  this._userS.cudUsuarios().doc(this.id_user).valueChanges().subscribe((upusuario: Usuario) => {
                    this.updateU = upusuario;
                    this.userForm.get(['nombre']).setValue(this.updateU.nombre);
                    this.userForm.get(['puesto']).setValue(this.updateU.puesto);
                  });
                  }
      }


  ngOnInit() {
  }

  onSubmit() {
    if (this.id_user) {
      this.usuario = this.userForm.value;
      this._userS.cudUsuarios().doc(this.id_user).update(this.usuario);
      this.router.navigate(['usuarios']);
      } else {
        this.usuario = this.userForm.value;
        this._userS.cudUsuarios().add(this.usuario);
      }
  }

}
