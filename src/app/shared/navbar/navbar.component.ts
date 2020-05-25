import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../general/model/usuario';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  admin: string;
  usuario: string;
  tesorero: string;
  rol: string;
  aprobador: string;

  constructor( private router: Router, private auth: AuthService, private userS: UsuariosService) {
    this.userS.cargarUsuarios().subscribe((usuarios: Usuario[]) => {
      usuarios.filter(responsable => {
        if (this.auth.currentUserValue === null) {
          return;
        }
        if (responsable.correo === this.auth.currentUserValue['usuario'].username
        ) {
          if ( responsable.rol === 'Administrador') {
            this.admin = responsable.rol;
          }
          if (responsable.rol === 'Usuario') {
            this.usuario = responsable.rol;
          }
          if ( responsable.rol === 'Tesorero') {
            this.tesorero = responsable.rol;
          }
          if ( responsable.rol === 'Aprobador') {
            this.aprobador = responsable.rol;
          }
        }
      });
    });
   }
  ngOnInit() {

  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
