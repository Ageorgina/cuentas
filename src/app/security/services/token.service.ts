import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  static token: string;
constructor() { }


intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const tokenReq = req.clone({
    setHeaders: {
      Authorization:  `Bearer ${sessionStorage.getItem('token')}`
      //, 'Access-Control-Allow-Origin': '*' //,
      //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }
  });

  return next.handle(tokenReq);
}

}