import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/services/auth.service';
import { UsuariosService } from '../../services';
import { Usuario } from '../../general/model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  admin: string;
  usuario: string;
  tesorero: string;
  rol: string;
  aprobador: string;
  financiero: string;
  user: string;
  imagen: string;
  constructor( private router: Router, private auth: AuthService, private userS: UsuariosService) {
    this.userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
      usuarios.filter(responsable => {
        if (this.auth.currentUserValue === null) {
          return;
        }
        this.user = this.auth.currentUserValue['usuario'].username;
        this.userS.cargarUsuarios().subscribe(users => {
          users.filter(usuarioSv => {
            if (this.user === usuarioSv['correo']) {
              this.imagen = usuarioSv['imagen'];
            }
          });
        });
        if (responsable.correo === this.auth.currentUserValue['usuario'].username
        ) {
          if ( responsable.rol === 'Administrador') {
            this.admin = responsable.rol;
          } else if (responsable.rol === 'Usuario') {
            this.usuario = responsable.rol;
          } else if ( responsable.rol === 'Tesorero') {
            this.tesorero = responsable.rol;
          } else if ( responsable.rol === 'Aprobador') {
            this.aprobador = responsable.rol;
          } else if ( responsable.rol === 'Financiero') {
            this.financiero = responsable.rol;
          }
        }
      });
    });
   }


  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
