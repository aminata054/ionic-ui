import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCategoriesPage } from './edit-categories.page';

describe('EditCategoriesPage', () => {
  let component: EditCategoriesPage;
  let fixture: ComponentFixture<EditCategoriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
