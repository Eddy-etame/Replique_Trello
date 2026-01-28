import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProjet } from './detail-projet';

describe('DetailProjet', () => {
  let component: DetailProjet;
  let fixture: ComponentFixture<DetailProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProjet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProjet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
