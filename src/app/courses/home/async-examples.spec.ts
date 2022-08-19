import { fakeAsync, tick } from "@angular/core/testing";

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
        // it('Async test example using Jasmine done()', (done:DoneFn) => {
        //     let test = false;
        //     setTimeout(() => {
        //         test = true;
        //         expect(test).toBeTruthy();
        //         done();
        //     }, 1000); 
        // });

        // More flexible than Jasmine done():
        it('Async test example - setTimeout()',  fakeAsync(() => {
            let test = false;
            setTimeout(() => {
                test = true;
                expect(test).toBeTruthy();
            }, 1000); 
            // Resolve error: 1 timer still in queue by using tick()
            tick(1000); // Call within fakeAsync zone only.
        }));

        fit('Async test example - Promise', (() => {
            let test = false;
           // Promises go into micro task queue
           // setTimeout is a macro taskt
           setTimeout(()=> {
            console.log('setTimeout 1')
           });
           setTimeout(()=> {
            console.log('setTimeout 2')
           });
           Promise.resolve().then(() => { // Both promises execute prior to all the setTimeouts
            console.log('Promise 1 resolved')
           })
           setTimeout(() => {
            console.log('setTimeout 3')
           })
           Promise.resolve().then(() => {
            console.log('Promise 2 resolved')
            return Promise;
           }).then(() => console.log('then on the Promise returned from Promise 2'))

        }));


    });
