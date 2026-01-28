import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterProjet } from './ajouter-projet';

describe('AjouterProjet', () => {
  let component: AjouterProjet;
  let fixture: ComponentFixture<AjouterProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterProjet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterProjet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
