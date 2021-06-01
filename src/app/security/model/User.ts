import {Usuario} from '../../general/model/usuario';

export class User {
  username: string;
  email: string;
  access_token: string;
  usuario: Usuario;
}
export class UserLog {
  email: string;
  rol: string;
  refresh: string;
  image: string;
  status: number;
}


