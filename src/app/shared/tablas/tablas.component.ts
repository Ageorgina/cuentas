import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.css']
})
export class TablasComponent implements OnInit {

  // headElements = ['ID', 'Fecha', 'Cantidad', 'Descripción', 'Tipo', 'Estatus', 'Proyecto', 'Responsable ASG'];
  // headElements = ['ID', 'Descripción', 'Empresa/ Cliente', 'Responsable ASG', 'Duración', 'Tipo Proyecto'];
   headElements = ['ID', 'Nombre', 'Cargo', 'Celular'];

  elements: any = [
    {id: 1, first: 'Mark', last: 'Otto', handle: '@mdo'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
