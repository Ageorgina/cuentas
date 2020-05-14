import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvReembolsoComponent } from './inv-reembolso.component';

describe('InvReembolsoComponent', () => {
  let component: InvReembolsoComponent;
  let fixture: ComponentFixture<InvReembolsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvReembolsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvReembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
