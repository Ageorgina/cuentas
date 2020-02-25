import { Component, OnInit } from '@angular/core';
import { GastosService } from '../../../services/gastos.service';

@Component({
  selector: 'app-inv-oficina',
  templateUrl: './inv-oficina.component.html',
  styleUrls: ['./inv-oficina.component.css']
})
export class InvOficinaComponent implements OnInit {
  titulo = 'Oficina';
  headTitle = ['Responsable ASG', 'Fecha', 'Tipo', 'Cantidad', 'Motivo', 'Modificar / Eliminar'];
  elements = [];

  constructor( private _gtsOfS: GastosService) { }

  ngOnInit() {
    this._gtsOfS.cargarGastosOF().subscribe( gastos => {
      console.log(gastos)
      this.elements = gastos;
    });
  }

}
