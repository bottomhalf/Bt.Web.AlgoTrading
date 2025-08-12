import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessTokenHandlerComponent } from './access-token-handler.component';

describe('AccessTokenHandlerComponent', () => {
  let component: AccessTokenHandlerComponent;
  let fixture: ComponentFixture<AccessTokenHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessTokenHandlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessTokenHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
