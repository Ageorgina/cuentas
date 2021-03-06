import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../general/utils/utils';
import { Area, Cliente, Usuario } from '../../../general/model';
import { ClientesService, AreasService, AlertasService, UsuariosService } from '../../../services';
import { UserLog } from '../../../security/model/User';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  titulo = 'Registrar Cliente';
  userLog = JSON.parse(sessionStorage.getItem('currentUser'))
  cliente = new Cliente;
  boton = 'Guardar';
  cteForm: FormGroup;
  // tslint:disable-next-line: variable-name
  id_cte: string;
  updateCte= new Cliente;
  textError: string;
  submitted = false;
  loading = true;
  actualizar = false;
  areaForm: FormGroup;
  area = new Area;
  // tslint:disable-next-line:variable-name
  id_area: string;
  areas: Area[];
  updateArea = new Area;
  admin: boolean;

               // tslint:disable-next-line: variable-name
  constructor( private _cteS: ClientesService, public _areaS: AreasService, private formBuilder: FormBuilder, private _user: UsuariosService,
               private active: ActivatedRoute, private router: Router, public alert: AlertasService, public utils: Utils ) {

//    this.loading = false;
    this.cteForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      ap_p: [''],
      ap_m: [''],
      empresa: ['', Validators.required],
      puesto: ['', Validators.required],
      celular: ['']
    });
    this.areaForm = this.formBuilder.group({ nombre_area: ['', Validators.required] });
    this._areaS.cargarAreas().subscribe((areas: Area[]) => { this.areas = areas; });
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
        this.cteForm.get(['celular']).setValue(this.updateCte.celular); });
    }
    this.loading = false;
  }

  get fval() { return this.cteForm.controls; }
  get f() { return this.areaForm.controls; }

  onSubmit() {
    this.loading = true;
    this.submitted = true;

    if (this.cteForm.invalid == true) {
      this.textError = '¡Faltan campos por llenar!';
      this.alert.textError = this.textError;
      this.alert.showError();
      this.loading = false;
      return ;
    }
    if (!this.id_cte && this.cteForm.valid  === true) {
      this.submitted = false;
      this.cliente = this.cteForm.value;
      this.cliente.ap_p = this.cteForm.value.ap_p.toLowerCase();
      this.cliente.ap_m = this.cteForm.value.ap_m.toLowerCase();
      this.cliente.nombre = this.cteForm.value.nombre.toLowerCase();
      this.cliente.empresa = this.cteForm.value.empresa.toUpperCase();
      this._cteS.cudCtes().add(this.cliente);
      this.alert.showSuccess();
      this.limpiar();
      this.loading = false;
    }
    if (this.id_cte && this.cteForm.valid === true) {
      this.submitted = false;
      this.cliente = this.cteForm.value;
      this._cteS.cudCtes().doc(this.id_cte).update(this.cliente);
      this.router.navigate(['clientes']);
      this.alert.showSuccess();
      this.loading = false;
      }
    }

  addArea( ) {
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
      this.area.nombre_area = this.areaForm.value.nombre_area.toLowerCase();
      this._areaS.cudAreas().add(this.area);
      this.alert.showSuccess();
      this.limpiar();
      this.loading = false;
    }
    if (this.id_area && this.areaForm.valid) {
      this.submitted = false;
      this.area = this.areaForm.value.toLowerCase();
      this.alert.showSuccess();
      this._areaS.cudAreas().doc(this.id_area).update(this.area).finally( () => {
        this.backArea();
        this.loading = false;
        return ;
      });
      this.loading = false;
    }
  }

  limpiar() {
    this.submitted = false;
    this.cteForm.reset();
    this.areaForm.reset();
    this.loading = false;
  }

  checkLetras($event: KeyboardEvent) { this.utils.letras($event); }
  checkNumeros($event: KeyboardEvent) { this.utils.numeros($event); }

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
      } );
    }
  }

  backArea() {
    this.areaForm.reset();
    this.actualizar = false;
  }
}
