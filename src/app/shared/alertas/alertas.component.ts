import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'alerta',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {
  exito: boolean;
  buttonTextErr = ' false ';
  buttonTextExi = ' true ';
  clicked = false;

  constructor() { }

  ngOnInit() {
  }

  fallido() {
    this.exito = false;
    this.clicked= true;
    console.log('entro a error');
Swal.fire({
  icon: 'error',
  title: 'Ocurrio un error, intentalo más tarde',
  showConfirmButton: false,
  timer: 1500
});
}
exitoso() {
  this.exito = true;
  this.clicked= true;
  console.log('entro a exito');
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Se realizo con éxito la operación',
    showConfirmButton: false,
    timer: 1500
  });
}

}

