export class UserBase {
   public usuario: {
      username: string;
      email: string;
      santo: string;
      correoPrincipal: string;
      telefonoPrincipal: string;
      claveTelefono: string;
      extension: string;
      activo: boolean;
      preguntaRescate: string;
      respuestaRescate: string;
      admin: boolean;
      rol: number;
      rolNombre: string;
      passOld: string;
      passNew?: string;
      id_Usuario?: number;
      id_cuenta: number;
      nombreEntidad: string;
      numeroFiscal: string;

    };

    constructor( ) {
        this.usuario = {
            username: 'base@prueba.com',
            santo: '123456',
            passOld: '123456',
            email: 'base@prueba.com',
            correoPrincipal: 'base@prueba.com',
            telefonoPrincipal  : '5512345678',
            claveTelefono :  '52',
            extension :  '2',
            activo : true,
            preguntaRescate : '¿this.preguntaRescate?',
            respuestaRescate : 'this.respuestaRescate',
            admin : false,
            rol : 0,
            rolNombre : 'Administrador',
            id_cuenta: 1,
            nombreEntidad: "Temporal",
            numeroFiscal: "Temporal"
        }
    }
}
