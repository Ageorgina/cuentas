import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GastosService } from '../../../services/gastos.service';

@Component({
  selector: 'app-registro-oficina',
  templateUrl: './registro-oficina.component.html',
  styleUrls: ['./registro-oficina.component.css']
})
export class RegistroOficinaComponent implements OnInit {
  titulo = 'Gastos Oficina';
  usuarios =  [];
  gasto = {};
  gastos = [];
  ofForm: FormGroup;
  constructor( private formBuilder: FormBuilder,
               // tslint:disable-next-line: variable-name
               private _user: UsuariosService,
               // tslint:disable-next-line: variable-name
               private _gtsOf: GastosService
  ) {
    this._user.cargarUsuarios().subscribe(usuarios => {
      console.log(usuarios);
      this.usuarios = usuarios; });
    }

ngOnInit() {

  this.ofForm = this.formBuilder.group({

    resp_asg: ['', Validators.required],
    fecha: ['', Validators.required],
    cantidad: ['', Validators.required],
    motivo: ['', Validators.required],
    tipo: ['', Validators.required]
  });
}
onSubmit() {

this.gasto = this.ofForm.value;
console.log(this.gasto)
console.log(this.ofForm.value.fecha)
this._gtsOf.cudGastosOF().add(this.gasto);
}

}


