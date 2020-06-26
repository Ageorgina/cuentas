import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent {

  loading = false;

  constructor(
      private router: Router,
      private auth: AuthService,
  ) { }

   logout() {
    this.auth.logout();
   }
}
