import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private  router: Router){

  }
  canActivate(): Observable<boolean> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (sessionStorage.getItem('token')) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
}
