
export class Usuario {
    nombre: string;
    // tslint:disable-next-line: variable-name
    ap_p: string;
    // tslint:disable-next-line: variable-name
    ap_m: string;
    correo: string;
    password: string;
    // tslint:disable-next-line: variable-name
    puesto: string;
    // tslint:disable-next-line: variable-name
    resp_asg: string;
    area: string;
    // tslint:disable-next-line: variable-name
    id_user: string;
    // tslint:disable-next-line:variable-name
    resp_area: boolean;

  authenticated: boolean;
  rol: string;

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }

  contieneRol(r: string) {
    if (this.rol) {
      const ks = Object.keys(this.rol);
      for (const k of ks) {
        if (this.rol[k] === r) {
          return true;
        }
      }
    }
    return false;
  }
  }
