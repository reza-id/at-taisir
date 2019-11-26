import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesContainerComponent } from './pages-container.component';

describe('PagesContainerComponent', () => {
  let component: PagesContainerComponent;
  let fixture: ComponentFixture<PagesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
