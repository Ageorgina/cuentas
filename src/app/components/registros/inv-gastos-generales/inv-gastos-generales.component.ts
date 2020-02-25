import { Component, OnInit } from '@angular/core';
import { GastosService } from '../../../services/gastos.service';

@Component({
  selector: 'app-inv-gastos-generales',
  templateUrl: './inv-gastos-generales.component.html',
  styleUrls: ['./inv-gastos-generales.component.css']
})
export class InvGastosGeneralesComponent implements OnInit {
  titulo = 'Gastos Generales';
  headTitle = ['Responsable ASG', 'Fecha', 'Cantidad', 'Motivo', 'Tipo', 'Proyecto', 'Estatus', 'Modificar / Eliminar'];
  elements = [];
  constructor( private _gstS: GastosService) { }

  ngOnInit() {
    this._gstS.cargarGastos().subscribe(gastos => {
        this.elements = gastos;
      });
  }

}
