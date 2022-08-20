import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";

describe("CourseService", () => {

    let coursesService: CoursesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // Because we testing CoursesService, we want the 
            // actual implementation of CoursesService.
            providers: [CoursesService]
        });
    });

    it('should return all courses', () => {

    });

});