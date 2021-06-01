import { Component } from '@angular/core';
import { AuthService } from '../../security/services/auth.service';
import { Menu } from '../../general/model';
import { DescargasService } from '../../services/srv_shared/descargas.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userLog = JSON.parse(sessionStorage.getItem('currentUser'));
  rol: string;
  user: string;
  imagen: string;
  opts: any = [];

  constructor( private auth: AuthService,  private descargas: DescargasService) {

    if ( this.userLog['status'] !== 200) {
      return;
    } else {
      this.imagen = this.userLog.imagen;
      this.user = this.userLog.correo;
      this.auth.getMenu(this.userLog.rol).toPromise().then(response => {
        this.opts = response;
      }).catch(() => {
        this.logout();
      })


    }
  }
  descargar( ) {
    window.open('https://firebasestorage.googleapis.com/v0/b/cuentas-ffc8b.appspot.com/o/guia.pdf?alt=media&token=75670271-0c25-4a09-9af8-9f0e282a525f')
  }

  logout() {
    this.auth.logout();
  }

}
