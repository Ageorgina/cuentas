import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/services/auth.service';

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

  constructor( private router: Router, private auth: AuthService) {
    this.admin = this.auth.admin;
    this.usuario = this.auth.usuario;
    this.tesorero = this.auth.tesorero;
   }
  ngOnInit() {

  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
