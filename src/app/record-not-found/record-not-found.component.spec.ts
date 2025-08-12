import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordNotFoundComponent } from './record-not-found.component';

describe('RecordNotFoundComponent', () => {
  let component: RecordNotFoundComponent;
  let fixture: ComponentFixture<RecordNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
