import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  textError = 'Error';
  textWarning = 'Alerta!';
  textWarningSuccess = 'Alerta!';
  textInfo = 'Alerta!';
  tittleS = 'Se realizó con éxito la operación';
  timer = 1500;
  seguro = true;

  constructor() {

  }

  showSuccess() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: this.tittleS,
      showConfirmButton: false,
      timer: this.timer
    });
  }
  showWarning() {
    Swal.fire({
      title: '¿Estas seguro?',
      text: this.textError,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4E936F',
      cancelButtonColor: '#c34613',
      confirmButtonText: this.textWarning
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          this.textWarningSuccess,
          '',
          'success',
        );
      }
    });
  }
  showError() {
    Swal.fire({
  icon: 'error',
  title: 'Ocurrio un error!',
  text: this.textError,
  showConfirmButton: false,
  timer: 1500
});

  }
  showInfo() {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: this.textInfo,
      showConfirmButton: true,
      confirmButtonColor: '#4E936F',
    });
  }

}
