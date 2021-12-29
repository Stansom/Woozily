import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterMenuComponent } from './filter-menu.component';
import { AppModule } from '../app.module';
import { platformBrowser } from '@angular/platform-browser';

describe('FilterMenuComponent', () => {
  let component: FilterMenuComponent;
  let fixture: ComponentFixture<FilterMenuComponent>;

  beforeEach(async () => {
    TestBed.initTestEnvironment(AppModule, platformBrowser());
    await TestBed.configureTestingModule({
      declarations: [FilterMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
