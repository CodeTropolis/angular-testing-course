import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES } from "../../../../server/db-data";

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
       // the mock http request will simulate a 
       // response only when flush is called. 
       // This response will be passed to the subscribe block of findAllCourses.
       req.flush({payload: Object.values(COURSES)})
       // ? hmmm, without req.flush(...) the test still passes although the 
       // console.log logs nothing in the subscribe block.
    });

});