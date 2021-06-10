import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { Usuario } from '../../general/model';
import { UsuariosService } from '../../services/usuarios.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  @ViewChild('infoModal') infoModal: ElementRef;
  @Input() email: string;
  user: any;
  ctaForm: FormGroup;
  loading = false;
  constructor(private service: UsuariosService, private formBuilder: FormBuilder ) { 
    this.ctaForm = this.formBuilder.group({
      clave:[''],
      correo:[''],
      banco:[''],
      ap_p:['']
   })
  
  }

  ngOnInit() {


  }
  clicked(){
    this.loading = true;
    this.infoModal.nativeElement.click();
    this.service.cargarCuentas().subscribe(response=> {

      this.user = response.find(usuario => usuario['correo'] === this.email);
      if(this.user === undefined){
        this.loading = false;
        return;
      }
      this.loading = false;
      this.ctaForm.get(['ap_p']).setValue(this.user.ap_p.toUpperCase()+' '+this.user.ap_m.toUpperCase()+ ''+ this.user.nombre.toUpperCase())
      this.ctaForm.get(['banco']).setValue(this.user.banco.toUpperCase())
      this.ctaForm.get(['clave']).setValue(this.user.clave)
      this.ctaForm.get(['correo']).setValue(this.user.correo)
      this.loading = false;
    }, ()=>{
      this.loading = false;
    })
  }

}
