import { fakeAsync } from "@angular/core/testing";

fdescribe("Async Testing Examples", () => {
    // it('Async test example using Jasmine done()', () => {
    //     let test = false;
    //     setTimeout(() => {
    //         test = true;
    //         expect(test).toBeTruthy();
    //     }, 1000); 
    //     // Console error: "expect was used when there was no current spec." due to 
    //     // setTimeout running after the test runner is considering the test completed.
    // });
    // Fix:
        //     it('Async test example using Jasmine done()', (done:DoneFn) => {
    //         let test = false;
    //         setTimeout(() => {
    //             test = true;
    //             expect(test).toBeTruthy();
    //             done();
    //         }, 1000); 
    //     });

        // More flexible than Jasmine done():
        it('Async test example using Jasmine done()',  fakeAsync((done:DoneFn) => {
            let test = false;
            setTimeout(() => {
                test = true;
                expect(test).toBeTruthy();
                done();
            }, 1000); 
        }));
    });
