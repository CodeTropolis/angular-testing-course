import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {
    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule], // We do not want to use real http service so that we avoid sending requests to production server.
            providers: [CoursesService] // We want the actual service to be created.
        });
        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });
 
    xit('should find all courses', () => {
        coursesService.findAllCourses().subscribe(courses => {
            expect(courses).toBeTruthy();
            expect(courses.length).toBe(12 ,"incorrect number of courses");
            const course = courses.find(course => course.id == 12);
            expect(course.titles.description).toBe("Angular Testing Course");
        });
            
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        req.flush({payload: Object.values(COURSES)});
    });

    it('should find a course by id', () => {
        coursesService.findCourseById(12).subscribe(course => {
            //console.log(`🚀 ~ coursesService.findCourseById ~ course`, course["payload"].id);
            expect(course).toBeTruthy();
            expect(course["payload"].id).toBe(12);
        });
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('GET');
        req.flush({payload: COURSES[12]});
    });

    it('should save the course data', () => {
        const changes = {
            titles: {description: 'New Description'}
        };
        coursesService.saveCourse(12, changes).subscribe(course => {
            expect(course).toBeTruthy();
            expect(course["payload"].id).toBe(12);
            expect(course["payload"].titles.description).toBe('New Description');
        } );
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        req.flush({payload: Object.assign(COURSES[12], changes)});
        //req.flush({...COURSES[12], ...changes});
    });
    
    it('should give an error if save fails', () => {
        const changes = {
            titles: {description: 'New Description'}
        };
        coursesService.saveCourse(12, changes)
            .subscribe(
                course => fail('the save operation should have failed'),
                (err:HttpErrorResponse) => {
                    expect(err.status).toBe(500);
                }
            );
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        req.flush('Save failed', {status: 500, statusText: 'Internal Server Error'});
    } );

    it('should find lessons for a course', () => {
        coursesService.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3);
            } );

        //const req = httpTestingController.expectOne(req => req.url.includes('/api/lessons?courseId=12&pageNumber=0&pageSize=3'));
        // Use a predicate to match the request url.
        const req = httpTestingController.expectOne(req => req.url ==('/api/lessons'));
        expect(req.request.method).toEqual('GET');

        // Assert parameters:

        // Corresponds to the courseId parameter in findLessons() above.
        // Rest of the params are using default values from findLessons() in courses.service.
        expect(req.request.params.get('courseId')).toEqual('12'); 
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({payload: findLessonsForCourse(12).slice(0, 3)}); // .slice(0, 3); corresponds to the pageSize parameter above
        
    });

    afterEach(() => {
        httpTestingController.verify(); // Verifies that no requests are outstanding.
    });
});