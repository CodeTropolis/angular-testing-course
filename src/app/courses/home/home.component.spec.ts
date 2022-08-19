import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';
import {HomeComponent} from './home.component';
import {CoursesService} from '../services/courses.service';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';

fdescribe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(course => course.category === "BEGINNER");
  const advancedCourses = setupCourses().filter(course => course.category === "ADVANCED");

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])

    TestBed.configureTestingModule({
      imports:[
        CoursesModule,
        NoopAnimationsModule // "No operation animations module. Without this, tab group would break."
      ],
      // Override CoursesService w/coursesServiceSpy
      providers: [{provide: CoursesService, useValue: coursesServiceSpy}]
    }).compileComponents().then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
    })

  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    // Happens synchronously. The mock implementation of CoursesService returns data immediately.
    // ?? Not asserting beginner courses. We could pass in in advancedCourses and this test will still pass.
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges(); // apply data to DOM.
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found.");
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found.");
  });

  // ?This is a state that cannot exist for the user as only one tab at a time can be displayed
  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found.");

  });

 // done: DoneFn = Lecture 26 around 6:00
  xit("should display advanced courses when tab clicked", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    el.nativeElement.click(tabs[1]);
    // Need  fixture.detectChanges() else the test will think we are looking for the 
    // first title in Beginners as the DOM wasn't updated until we ran detectChanges()
    // Test still fails.  The tab switch is performing an async operation (requestAnimationFrame()) due to the animation.
    fixture.detectChanges(); 
    const cardTitles = el.queryAll(By.css('.mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles.");
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

  });

  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);
    // Need  fixture.detectChanges() else the test will think we are looking for the 
    // first title in Beginners as the DOM wasn't updated until we ran detectChanges()
    fixture.detectChanges(); 
    flush();  // Make sure task queue is completely empty prior to running assertions.
    const cardTitles = el.queryAll(By.css('.mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles.");
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

});


