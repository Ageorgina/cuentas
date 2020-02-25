import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gastos-generales',
  templateUrl: './gastos-generales.component.html',
  styleUrls: ['./gastos-generales.component.css']
})
export class GastosGeneralesComponent implements OnInit {
  exito: boolean ;
  buttonText = 'Guardar';

  constructor(  ) { }

  ngOnInit() {
  }
  ir(prueba) {
    console.log(prueba);
  }
  prueba() {
    this.exito = true;
  }

}
