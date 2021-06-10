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
    window.open('https://firebasestorage.googleapis.com/v0/b/gastos-asg.appspot.com/o/guia.jpg?alt=media&token=9a1643d2-9018-42f9-a7ff-3bd80c0e5a16')
  }

  logout() {
    this.auth.logout();
  }

}
