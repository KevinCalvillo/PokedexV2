import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeCardViewerComponent } from './poke-card-viewer.component';

describe('PokeCardViewerComponent', () => {
  let component: PokeCardViewerComponent;
  let fixture: ComponentFixture<PokeCardViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeCardViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeCardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
