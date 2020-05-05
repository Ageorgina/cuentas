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
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthService,
  ) {
      this.authenticationService.logout();
      this.router.navigate(['login']);
  }

}
