import { Component } from '@angular/core';
import { AuthService } from '../../security/services/auth.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public usuarioActual: any;
  rol: string;
  user: string;
  imagen: string;
  public admin: boolean;
  public aprobador: boolean;
  public tesorero: boolean;
  public financiero: boolean;
  public rolU: boolean;

  constructor( private auth: AuthService) {
    if ( this.auth.userFb === undefined) {
      return;
    } else {
      this.usuarioActual = this.auth.userFb;
      this.imagen = this.usuarioActual.imagen;
      this.user = this.usuarioActual.correo;
      this.admin = this.auth.admin;
      this.aprobador = this.auth.aprobador;
      this.tesorero = this.auth.tesorero;
      this.financiero = this.auth.financiero;
      this.rolU = this.auth.rolU;

    }
  }

  logout() {
    this.auth.logout();
  }

}
