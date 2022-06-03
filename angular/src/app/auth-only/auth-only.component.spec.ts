import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthOnlyComponent } from './auth-only.component';

describe('AuthOnlyComponent', () => {
  let component: AuthOnlyComponent;
  let fixture: ComponentFixture<AuthOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthOnlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
