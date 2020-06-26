import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {
  textError = 'Ocurrio un error, Inténtalo más tarde';
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
  timer: this.timer
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


  formInvalid() {
    Swal.fire({
      icon: 'error',
      title: '¡Ocurrio un error!',
      text: '¡Faltan campos por llenar!',
      showConfirmButton: false,
      timer: this.timer
  });
  }
  serverError() {
    Swal.fire({
      icon: 'error',
      title: '¡Error en el servidor!',
      text: 'Inténtalo más tarde',
      showConfirmButton: false,
      timer: this.timer
  });
  }
  invalidPass() {
    Swal.fire({
      icon: 'error',
      title: '¡Contraseña inválida!',
      showConfirmButton: false,
      timer: this.timer
  });
  }
  userDoesntExist() {
    Swal.fire({
      icon: 'error',
      title: '¡El correo no existe!',
      showConfirmButton: false,
      timer: this.timer
  });
  }
  vaciosError() {
    Swal.fire({
      icon: 'error',
      title: '¡Los campos no pueden ir vacios!',
      showConfirmButton: false,
      timer: this.timer
  });
  }
  invalidUser() {
    Swal.fire({
      icon: 'error',
      title: 'Correo Inválido',
      showConfirmButton: false,
      timer: this.timer
  });
  }
  dontMatch() {
    Swal.fire({
      icon: 'error',
      title: 'El correo y la contraseña no coinciden',
      showConfirmButton: false,
      timer: this.timer
  });
  }
  validError() {
    Swal.fire({
      icon: 'error',
      title: '¡Datos inválidos!',
      showConfirmButton: false,
      timer: this.timer
  });
  }
  changeInfoSuccess() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Se reiniciará tu sesión',
      showConfirmButton: false,
      timer: 2000
    });
  }

}
