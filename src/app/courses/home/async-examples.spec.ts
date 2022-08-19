import { fakeAsync, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import {delay} from 'rxjs/operators'

fdescribe("Async Testing Examples", () => {
    xit('Async test example using setTimeout()', () => {
        let test = false;
        setTimeout(() => {
            test = true;
            expect(test).toBeTruthy();
        }, 1000); 
        // Console error: "expect was used when there was no current spec." due to 
        // setTimeout running after the test runner is considering the test completed.
    });
        // Fix:
    xit('Async test example using Jasmine done()', (done:DoneFn) => {
        let test = false;
        setTimeout(() => {
            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000); 
    });

    // More flexible than Jasmine done():
    xit('Async test example - setTimeout()',  fakeAsync(() => {
        let test = false;
        setTimeout(() => {
            test = true;
            expect(test).toBeTruthy();
        }, 1000); 
        // Resolve error: 1 timer still in queue by using tick()
        tick(1000); // Call within fakeAsync zone only.
    }));

    xit('Async test example - Promise', (() => {
        let test = false;
        // Promises go into micro task queue.
        // setTimeout is a macro task.
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

    xit('Async test example - Promise + setTimeout()', fakeAsync(() => {
        let counter = 0;
        Promise.resolve().then(() => {
            counter+=10;
            //expect(counter).toBe(10);
            setTimeout(() => {
                counter+=1;
            }, 1000);
        })
        expect(counter).toBe(0);
        flushMicrotasks(); // Flush the micro task queue.
        expect(counter).toBe(10);
        tick(1000);
        expect(counter).toBe(11);
    }));

    xit('Async text - synchronous observable', () => {
        let test = false;
        console.log('Creating Observable');
        const test$ = of(test);
        test$.subscribe(() => {
            test = true;
        });
        console.log('Running test assertions.');
        expect(test).toBe(true); // Test passes
    });
    
    xit('Async text - async observable (delay) this will fail', () => {
        let test = false;
        console.log('Creating Observable');
        const test$ = of(test).pipe(delay(1000));// Now we have an observable that is not synchronous.
        test$.subscribe(() => {
            test = true;
        });
        console.log('Running test assertions.');
        expect(test).toBe(true); // Test fails
    });
    // Fix
    xit('Async text - async Observable fixed', fakeAsync(() => {
        let test = false;
        console.log('Creating Observable');
        const test$ = of(test).pipe(delay(1000)); // Now we have an observable that is not synchronous.
        test$.subscribe(() => {
            test = true;
        });
        tick(1000); // This is the fix.
        console.log('Running test assertions.');
        expect(test).toBe(true); // Test passes.
    }));

});
