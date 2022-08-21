import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

fdescribe("CourseService", () => {

    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // We don't want to use the actual HttpClient in order to 
            // avoid sending requests to our server.
            imports: [HttpClientTestingModule],
            // Because we testing CoursesService, we want the 
            // actual implementation of CoursesService.
            providers: [CoursesService]
        });
        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should return all courses', () => {
        coursesService.findAllCourses().subscribe(courses => {
            console.log(courses)
            expect(courses).toBeTruthy('No courses returned.');
            expect(courses.length).toBe(12, "Incorrect number of courses");
            const course = courses.find(c => c.id === 12);
            expect(course.titles.description).toBe("Angular Testing Course");
        });
        // Return test data:
       const req =  httpTestingController.expectOne('/api/courses');
       expect(req.request.method).toEqual("GET");

       // Specify the data that should be returning.
       // We don't need the back end server (localhost:9000) to be running.
       // the mock http request will simulate a response only when flush is called. 
       // This response will be passed to the subscribe block of findAllCourses.
       req.flush({payload: Object.values(COURSES)})
       // ? hmmm, without req.flush(...) the test still passes although the 
       // console.log logs nothing in the subscribe block.
    });

    it('should retrieve course by id', () => {
        coursesService.findCourseById(12).subscribe(course => {
            expect(course).toBeTruthy();
            expect(course.id).toBe(12);
        });
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("GET");
        req.flush(COURSES[12]);
    });

    it('should save course data', () => {
        const changes:Partial<Course> = {titles:{description: 'Testing Course'}}
        coursesService.saveCourse(12, changes)
            .subscribe(course => {
                expect(course.id).toBe(12);
                // Per Hemant in Lecture 14 Q&A:
                expect(course.titles.description).toBe(changes.titles.description, "Data not saved.");

            });
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("PUT");
        //expect(req.request.body.titles.description).toEqual(changes.titles.description);
        req.flush({
            ...COURSES[12],
            ...changes
        })
    });

    it('should give an error if save course fails.', () => {
        const changes: Partial<Course> = {titles:{description:'Testing Course'}};
        coursesService.saveCourse(12, changes)
            .subscribe(()=>
                fail('the saved course operation should have failed.'),
                (error:HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                
            });
        // Withoug const req = ... will get: Expected no open requests, found 1: PUT /api/courses/12
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("PUT");
        // This fails... We should get a "successful failure".
           // In subscribe block, removed {} and used .subscribe syntax as shwon.
        // Test now passes.
        req.flush('Save course failed', {status: 500,
            statusText:"Internal server error"});
    });

    afterEach(() => {
        httpTestingController.verify();
    })

});