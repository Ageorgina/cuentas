import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  titulo = 'Usuarios ASG';
  usuario = {};
  userForm: FormGroup;

  constructor(private _userS: UsuariosService , private formBuilder: FormBuilder) {

     }

  ngOnInit() {

    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      puesto: ['', Validators.required]
  });


}

  onSubmit() {
    this.usuario = this.userForm.value;
    this._userS.cudUsuarios().add(this.usuario);

  }
}
