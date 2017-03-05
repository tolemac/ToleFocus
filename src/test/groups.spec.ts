import { focusManager, focusObserver } from "../index";

let container: HTMLElement;

describe("Focusing groups -> ", () => {
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

    it("Focus enter on group elements", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus id="e1" />
        <div focus-group>
            <input id="e2" />
            <input id="e3" />
        </div>
        <input id="e4" />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["e1", "e2", "e3", "e4"];
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

    it("Focus enter on sub groups elements", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus id="e1" />
        <div focus-group>
            <input id="e2" />
            <input id="e3" />
            <div focus-group>
                <input id="e4" />
                <input id="e5" />
            </div>
        </div>
        <input id="e6" />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["e1", "e2", "e3", "e4", "e5", "e6"];
            const testArray = [];
            for (let i = 0; i < 6; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });

    it("Focus order in groups", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus id="e1" />
        <div focus-group>
            <input id="e2" />
            <input id="e3" />
        </div>
        <div focus-group focus-order="1">
            <input id="e4" />
            <input id="e5" />
        </div>
        <input id="e6" />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["e1", "e4", "e5", "e2", "e3", "e6"];
            const testArray = [];
            for (let i = 0; i < 6; i++) {
                testArray.push(document.activeElement.id);
                focusManager.focusNext();
            }
            expect(JSON.stringify(expectArray)).toEqual(JSON.stringify(testArray));
            container.removeChild(elem);
            done();
        }, 1);
    });

    it("Have to jump empty groups", (done: any) => {
        const elem = document.createElement("div");
        elem.innerHTML = `
        <input autofocus id="e1" />
        <div focus-group>
        </div>
        <div focus-group>
        </div>
        <div focus-group>
            <input id="e4" />
            <input id="e5" />
        </div>
        <div focus-group>
        </div>
        <input id="e6" />
        `;
        container.appendChild(elem);

        setTimeout(() => {
            const expectArray = ["e1", "e4", "e5", "e6"];
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
