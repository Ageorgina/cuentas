
export class Usuario {
    nombre: string;
    username: string;
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
    idUsuario: number;
    activo: boolean;
    imagen: string;
    creado: string;
    constructor( ) {
      this.idUsuario = 0;
      // tslint:disable-next-line:max-line-length
      this.imagen = 'https://firebasestorage.googleapis.com/v0/b/gastos-asg.appspot.com/o/usuarios%2Fusuario.png?alt=media&token=4749c4e5-9da8-42ef-ae5e-ddef8fefe95f';
    }
  }


// tslint:disable-next-line:class-name
export class usuarioU {
    public usuario: {
      idUsuario: number;
      username: string;
      passOld: string;
      passNew: string;
      email: string;
    };


  }
