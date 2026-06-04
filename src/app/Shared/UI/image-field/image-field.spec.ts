import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageField } from './image-field';

describe('ImageField', () => {
  let component: ImageField;
  let fixture: ComponentFixture<ImageField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
