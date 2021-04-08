import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtShareComponent } from './court-share.component';

describe('CourtShareComponent', () => {
  let component: CourtShareComponent;
  let fixture: ComponentFixture<CourtShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
