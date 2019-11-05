import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AyatComponent } from './ayat.component';

describe('AyatComponent', () => {
  let component: AyatComponent;
  let fixture: ComponentFixture<AyatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AyatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AyatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
