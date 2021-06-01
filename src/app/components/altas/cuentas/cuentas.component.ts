import { Component, OnInit } from '@angular/core';
import { Cuenta } from '../../../general/model';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {
  userLog = JSON.parse(sessionStorage.getItem('currentUser'))
  cuenta = new Cuenta;
  boton = 'Guardar';
  ctaForm: FormGroup;
  titulo = 'Registrar Cuenta';
  submitted  = false;
  loading = true;
  constructor(private servicio: UsuariosService, private formBuilder: FormBuilder ) {
    console.log(this.userLog.email)
    this.ctaForm = this.formBuilder.group({
      clave: [''],
      correo: ['',Validators.email],
      banco: [''],
      ap_p:[''],
      ap_m:[''],
      nombre:['']
   })
  }
  get fval() { return this.ctaForm.controls; }
  ngOnInit() {
    this.loading = false;
  }
  onSubmit(){
    this.submitted = true;
    this.cuenta = this.ctaForm.value;
    this.cuenta.createby = this.userLog.email;
    this.servicio.cudCuentas().add(this.cuenta);
    this.ctaForm.reset();
    console.log('fval',this.cuenta)
  }

}
