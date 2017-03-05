import { focusManager, focusObserver } from "../index";

describe("Focusing elements -> ", () => {
    beforeEach(() => {
        focusObserver.disable();
        focusManager.disable();
        focusManager.enable();
        focusObserver.enable();
    });

    it("Add input to body", (done: any) => {
        const elem = document.createElement("input");
        document.body.appendChild(elem);

        setTimeout(() => {
            expect(focusManager.root.count).toEqual(1);
            document.body.removeChild(elem);
            done();
        }, 1);
    });
    it("Add div with input to body", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input/>";
        document.body.appendChild(elem);

        setTimeout(() => {
            expect(focusManager.root.count).toEqual(1);
            document.body.removeChild(elem);
            done();
        }, 1);
    });
    it("Add div with several inputs to body", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input/><input/><input/><input/>";
        document.body.appendChild(elem);

        setTimeout(() => {
            expect(focusManager.root.count).toEqual(4);
            document.body.removeChild(elem);
            done();
        }, 1);
    });
    it("Input with autofocus got focus", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input/><input id='auto' autofocus/><input/><input/>";
        document.body.appendChild(elem);

        setTimeout(() => {
            const auto = document.getElementById("auto");
            expect(auto).toEqual(document.activeElement);
            document.body.removeChild(elem);
            done();
        }, 1);
    });
    it("Next element got focus when call focusManager focusNext", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input/><input autofocus/><input id='next'/><input/>";
        document.body.appendChild(elem);

        setTimeout(() => {
            focusManager.focusNext();
            const next = document.getElementById("next");
            expect(next).toEqual(document.activeElement);
            document.body.removeChild(elem);
            done();
        }, 1);
    });
    it("Prior element got focus when call focusManager focusPrior", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = "<input id='prior'/><input autofocus/><input/><input/>";
        document.body.appendChild(elem);

        setTimeout(() => {
            focusManager.focusPrior();
            const prior = document.getElementById("prior");
            expect(prior).toEqual(document.activeElement);
            document.body.removeChild(elem);
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
        document.body.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i2", "i3", "i4"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            document.body.removeChild(elem);
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
        document.body.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i4", "i3", "i2"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            document.body.removeChild(elem);
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
        <input id='i7' />
        <input id='i6' focus-order='4' />
        <input id='i8' />
        `;
        document.body.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i3", "i4", "i5", "i6", "i7", "i8", "i2", "i1"];
            const testArray = [];
            for (let i = 0; i < 9; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            document.body.removeChild(elem);
            done();
        }, 1);
    });

    it("Loop back control. Tail 'loop'", (done: any) => {
        focusManager.disable();
        focusManager.enable(document.body, "loop", "loop");

        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='0' id='i1'/>
        <input id='i2' focus-order='1' />
        <input id='i3' focus-order='2' />        
        `;
        document.body.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i2", "i3", "i1"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            document.body.removeChild(elem);
            done();
        }, 1);
    });

    it("Loop back control. Head 'loop'", (done: any) => {
        focusManager.disable();
        focusManager.enable(document.body, "loop", "loop");

        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='0' id='i1'/>
        <input id='i2' focus-order='1' />
        <input id='i3' focus-order='2' />
        `;
        document.body.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i3", "i2", "i1"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusPrior();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            document.body.removeChild(elem);
            done();
        }, 1);
    });

    it("Loop back control. Tail 'stop'", (done: any) => {
        focusManager.disable();
        focusManager.enable(document.body, "stop", "stop");

        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='0' id='i1'/>
        <input id='i2' focus-order='2' />
        <input id='i3' focus-order='3' />        
        `;
        document.body.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i2", "i3", "i3"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            document.body.removeChild(elem);
            done();
        }, 1);
    });

    it("Loop back control. Head 'stop'", (done: any) => {
        focusManager.disable();
        focusManager.enable(document.body, "stop", "stop");

        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus focus-order='-1' id='i1'/>
        <input id='i2' focus-order='1' />
        <input id='i3' focus-order='2' />
        `;
        document.body.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["i1", "i1", "i1", "i1"];
            const testArray = [];
            for (let i = 0; i < 4; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusPrior();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            document.body.removeChild(elem);
            done();
        }, 1);
    });

});
