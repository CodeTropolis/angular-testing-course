import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule]
    })
    .compileComponents()
      .then(() => { // Need to use waitForAsync else rest of test suite is not waiting for this. Will get component undefined when asserting toBeTruthy.
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      })
  }));


  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {

    component.courses = setupCourses();
    const cards = el.queryAll(By.css('.course-card'));
    expect(cards).toBeTruthy("No course cards found");
    expect(cards.length).toBe(12, "unexpected number of courses");

  });


  it("should display the first course", () => {

      pending();

  });

});
