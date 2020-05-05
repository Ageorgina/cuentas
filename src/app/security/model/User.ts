import {Usuario} from '../../general/model/usuario';

export class User {
  username: string;
  rol: any;
  email: string;
  // tslint:disable-next-line:variable-name
  access_token: string;
  usuario: Usuario;
  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
