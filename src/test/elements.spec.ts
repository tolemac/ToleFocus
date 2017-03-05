import { focusManager, focusObserver } from "../index";

let container: HTMLElement;

describe("Focusing elements -> ", () => {
    beforeEach(() => {
        focusObserver.disable();
        focusManager.disable();
        focusManager.enable(container);
        focusObserver.enable(container);
    });

    beforeAll(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterAll(() => {
        document.body.removeChild(container);
    });

    it("Add input to body", (done: any) => {
        const elem = document.createElement("input");
        container.appendChild(elem);

        setTimeout(() => {
            expect(focusManager.root.count).toEqual(1);
            container.removeChild(elem);
            done();
        }, 1);
    });
    it("Add div with input to body", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input/>";
        container.appendChild(elem);

        setTimeout(() => {
            expect(focusManager.root.count).toEqual(1);
            container.removeChild(elem);
            done();
        }, 1);
    });
    it("Add div with several inputs to body", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input/><input/><input/><input/>";
        container.appendChild(elem);

        setTimeout(() => {
            expect(focusManager.root.count).toEqual(4);
            container.removeChild(elem);
            done();
        }, 1);
    });
    it("Hangle focus to all focusable elements", (done: any) => {
        // "a", "select", "button", "input", "textarea"
        const elem = document.createElement("div");
        elem.innerHTML = `
        <a autofocus id='i1'></a>
        <select id='i2'></select>
        <button type="button" id='i3'></button>
        <input id='i4' />
        <textarea id='i5' ></textarea>
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i2", "i3", "i4", "i5"];
            const testArray = [];
            for (let i = 0; i < 5; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });
    it("Input with autofocus got focus", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input/><input id='auto' autofocus/><input/><input/>";
        container.appendChild(elem);

        setTimeout(() => {
            const auto = document.getElementById("auto");
            expect(auto).toEqual(document.activeElement);
            container.removeChild(elem);
            done();
        }, 1);
    });
    it("Input with autofocus observe got focus", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input id='auto' autofocus/><input id='observe' autofocus='observe' style='display:none'/>";
        container.appendChild(elem);

        setTimeout(() => {
            const observe = document.getElementById("observe");
            observe.style.display = "block";
            setTimeout(() => {
                expect(observe).toEqual(document.activeElement);
                container.removeChild(elem);
                done();
            }, 200);
        }, 1);
    });

    it("Next element got focus when call focusManager focusNext", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input/><input autofocus/><input id='next'/><input/>";
        container.appendChild(elem);

        setTimeout(() => {
            focusManager.focusNext();
            const next = document.getElementById("next");
            expect(next).toEqual(document.activeElement);
            container.removeChild(elem);
            done();
        }, 1);
    });
    it("Prior element got focus when call focusManager focusPrior", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input id='prior'/><input autofocus/><input/><input/>";
        container.appendChild(elem);

        setTimeout(() => {
            focusManager.focusPrior();
            const prior = document.getElementById("prior");
            expect(prior).toEqual(document.activeElement);
            container.removeChild(elem);
            done();
        }, 1);
    });
    it("Focus order from 0 to 3", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='0' id='i1'/>
        <input id='i2' focus-order='1' />
        <input id='i3' focus-order='2' />
        <input id='i4' focus-order='3' />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i2", "i3", "i4"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });
    it("Focus order not sequential", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='0' id='i1'/>
        <input id='i2' focus-order='3' />
        <input id='i3' focus-order='2' />
        <input id='i4' focus-order='1' />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i4", "i3", "i2"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });

    it("Focus order negative order", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus id='i1'/>
        <input id='i2' focus-order='-2' />
        <input id='i3' />
        <input id='i4' focus-order='2' />
        <input id='i5' />
        <input id='i6' />
        <input id='i7' focus-order='4' />
        <input id='i8' />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i3", "i4", "i5", "i7", "i6", "i8", "i2", "i1"];
            const testArray = [];
            for (let i = 0; i < 9; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });

    it("Loop back control. Tail 'loop'", (done: any) => {
        focusManager.disable();
        focusManager.enable(container, "loop", "loop");

        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='0' id='i1'/>
        <input id='i2' focus-order='1' />
        <input id='i3' focus-order='2' />        
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i2", "i3", "i1"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });

    it("Loop back control. Head 'loop'", (done: any) => {
        focusManager.disable();
        focusManager.enable(container, "loop", "loop");

        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='0' id='i1'/>
        <input id='i2' focus-order='1' />
        <input id='i3' focus-order='2' />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i3", "i2", "i1"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusPrior();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });

    it("Loop back control. Tail 'stop'", (done: any) => {
        focusManager.disable();
        focusManager.enable(container, "stop", "stop");

        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='0' id='i1'/>
        <input id='i2' focus-order='2' />
        <input id='i3' focus-order='3' />        
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i2", "i3", "i3"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });

    it("Loop back control. Head 'stop'", (done: any) => {
        focusManager.disable();
        focusManager.enable(container, "stop", "stop");

        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='-1' id='i1'/>
        <input id='i2' focus-order='1' />
        <input id='i3' focus-order='2' />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i1", "i1", "i1"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusPrior();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });

    it("Focus non-focusable elements", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = `
        <div autofocus id="e1" focus-order></div>
        <input id="e2"/>
        <div id="e3" focus-order="1"></div>
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["e1", "e3", "e2", "e1"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });


});
