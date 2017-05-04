
function matches_polyfills() {
    const prototype = Element.prototype as any;

    if (!Element.prototype.matches) {
        Element.prototype.matches =
            prototype.matchesSelector ||
            prototype.mozMatchesSelector ||
            prototype.msMatchesSelector ||
            prototype.oMatchesSelector ||
            prototype.webkitMatchesSelector ||
            function (s) {
                let matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) { }
                return i > -1;
            };
    }
}

export function setPolyfills() {
    matches_polyfills();
}
