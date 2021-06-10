import { Pipe, PipeTransform } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {


  transform(email: string, arr: any): string {
    if(arr.length === 0){
      return email;
    } 
    let name: string; 
    if(email === 'mgrande@asgbpm.com' || email === 'administrador@asgbpm.com'){
      return 'Grande Zarza Michelle';
    }    if(email === 'rh@asgbpm.com'){
      return 'Valdes Trejo Jimena Sylvana';
    }
    let user = arr.find(user => user['correo'] === email);
    if(user === undefined){
      return email;
    } else {
      name = user['ap_p'].toLowerCase()+' '+user['ap_m'].toLowerCase()+' '+user['nombre'].toLowerCase()
      
      return name;
    }


  }

}
