import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../services/clientes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Cliente } from '../../../general/model/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/srv_shared/alertas.service';
import { Utils } from '../../../general/utils/utils';
import { Area } from '../../../general/model/area';
import { AreasService } from '../../../services/areas.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  titulo = 'Registrar Cliente';
  cliente: Cliente;
  boton = 'Guardar';
  cteForm: FormGroup;
  // tslint:disable-next-line: variable-name
  id_cte: string;
  updateCte: Cliente;
  textError: string;
  submitted = false;
  loading = true;
  actualizar = false;
  areaForm: FormGroup;
  area: Area;
  // tslint:disable-next-line:variable-name
  id_area: string;
  areas: Area[];
  updateArea: Area;

               // tslint:disable-next-line: variable-name
  constructor( private _cteS: ClientesService,
               // tslint:disable-next-line:variable-name
               public _areaS: AreasService,
               private formBuilder: FormBuilder,
               private active: ActivatedRoute,
               private router: Router,
               public alert: AlertasService,
               public utils: Utils
               ) {
                this.cteForm = this.formBuilder.group({
                  nombre: ['', Validators.required],
                  ap_p: [''],
                  ap_m: [''],
                  empresa: ['', Validators.required],
                  puesto: ['', Validators.required],
                  celular: ['']
                });
                this.areaForm = this.formBuilder.group({
                nombre_area: ['', Validators.required]
                });
                this._areaS.cargarAreas().subscribe((areas: Area[]) => { this.areas = areas;  });

                this.id_cte = this.active.snapshot.paramMap.get('id_cte');
                if (this.id_cte) {
                  this.loading = false;
                  this.actualizar = true;
                  this._cteS.cudCtes().doc(this.id_cte).valueChanges().subscribe((upCte: Cliente) => {
                    this.updateCte = upCte;
                    this.cteForm.get(['nombre']).setValue(this.updateCte.nombre);
                    this.cteForm.get(['ap_p']).setValue(this.updateCte.ap_p);
                    this.cteForm.get(['ap_m']).setValue(this.updateCte.ap_m);
                    this.cteForm.get(['puesto']).setValue(this.updateCte.puesto);
                    this.cteForm.get(['empresa']).setValue(this.updateCte.empresa);
                    this.cteForm.get(['celular']).setValue(this.updateCte.celular);
                  });
                  }

      }

  ngOnInit() {
    this.loading = false;
  }

  get fval() {

        return this.cteForm.controls;
  }
  get f() {
    return this.areaForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    if (!this.id_cte && this.cteForm.invalid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
    }
    if (!this.cteForm.valid) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
    }

    if (!this.id_cte && this.cteForm.valid ) {
      this.submitted = false;
      this.cliente = this.cteForm.value;
      this._cteS.cudCtes().add(this.cliente);
      this.alert.showSuccess();
      this.limpiar();
      this.loading = false;
    }


    if (this.id_cte && this.cteForm.valid) {
      this.submitted = false;
      this.cliente = this.cteForm.value;
      this._cteS.cudCtes().doc(this.id_cte).update(this.cliente);
      this.router.navigate(['clientes']);
      this.alert.showSuccess();
      this.loading = false;
      }

    }
    addArea() {
      this.loading = true;
      this.submitted = true;
      if (!this.id_area && this.areaForm.invalid) {
        this.textError = '¡Faltan campos por llenar!';
        this.alert.textError = this.textError;
        this.alert.showError();
        this.loading = false;
        return ;
      }
      if (this.id_area && !this.areaForm.valid) {
        this.textError = '¡Faltan campos por llenar!';
        this.alert.textError = this.textError;
        this.alert.showError();
        this.loading = false;
        return ;
      }
      if (!this.id_area && this.areaForm.valid) {
        this.submitted = false;
        this.area = this.areaForm.value;
        this._areaS.cudAreas().add(this.area);
        this.alert.showSuccess();
        this.limpiar();
        this.loading = false;
      }
      if (this.id_area && this.areaForm.valid) {
        this.submitted = false;
        this.area = this.areaForm.value;
        this.alert.showSuccess();
        this._areaS.cudAreas().doc(this.id_area).update(this.area).finally(
          // tslint:disable-next-line:only-arrow-functions
          () => {
            this.backArea();
            this.loading = false;
            return ;
          });
        this.loading = false;
      }

    }

limpiar() {
  // tslint:disable-next-line: no-unused-expression
  this.submitted;
  this.cteForm.reset();
  this.areaForm.reset();
  this.loading = false;
}

checkLetras($event: KeyboardEvent) {
  this.utils.letras($event);
}

checkNumeros($event: KeyboardEvent) {
  this.utils.numeros($event);
}
regresar() {
  this.router.navigate(['clientes']);
}

borrar( value ) {
  this.loading = true;
  this._areaS.cudAreas().doc(value.id_area).delete();
  this.alert.showSuccess();
  this.loading = false;
}

actualizar_area(value) {
  this.id_area = value.id_area;
  this.loading = true;
  if (this.id_area) {
    this.loading = false;
    this.actualizar = true;
    this._areaS.cudAreas().doc(this.id_area).valueChanges().subscribe((upArea: Area) => {
      this.updateArea = upArea;
      this.areaForm.get(['nombre_area']).setValue(this.updateArea.nombre_area);
    }
  );
  }
}
backArea() {
  this.areaForm.reset();
  this.actualizar = false;
}

}
