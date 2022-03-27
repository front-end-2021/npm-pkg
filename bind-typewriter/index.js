/** bind-typewriter npm
 * install on git: git+https://github.com/visionmedia/express.git
 * or:             git+ssh://git@github.com/visionmedia/express.git
 * 
 * @param start: undefined || string: '0.6s',
 * @param attribute: undefined || string: '[data-typewriter="animation"]',
 * @param cursorColor: undefined (default: black) || string: 'white'/'black'/'#fff',
 */

const bindTypewriter = (options) => {
    const DATE_NOW = window.bindTypewriter ? window.bindTypewriter.UId : Date.now();

    let _options = {
        start: '0.6s',
        attribute: `[data-typewriter="animation"]`,
        cursorColor: 'black'    // #fff
    };
    if (!!options)
        _options = Object.assign(_options, options);

    validateParams(_options);

    if (window.bindTypewriter) return window.bindTypewriter;

    return {
        UId: DATE_NOW,
        run: function () {
            if(!window.bindTypewriter) addStyle2Head(`dnba-style-texting_${DATE_NOW}`);
            
            var obsv;
            const list = document.querySelectorAll(`[data-typewriter="animation"]`);
            Array.prototype.forEach.call(list, function (item) {
                addAnimation(item);

                if (checkDuplicate(item)) return;
                item.classList.add(`dnba-text-typing_${DATE_NOW}`);
                obsv = addOrserver(item, function (mutation) {
                    if (canAddAnimation(mutation)) {
                        const target = mutation.target;      //console.log(mutation);
                        addAnimation(target);
                    }
                });
            });
            
            window.bindTypewriter = this;
            window.bindTypewriter.Observer = obsv;

            function checkDuplicate(node) {
                const cls = node.className;
                if (cls.includes('dnba-text-typing')) return true;
                return false;
            }
            function addStyle2Head(id) {
                addCommonStyle();
                addCustomStyle();

                function addCustomStyle() {
                    const cssContext = `.dnba-texting_${DATE_NOW} { 
                animation: typewriter_${DATE_NOW} 0.72s steps(9) ${_options.start} 1 normal both, 
                            endtyping_${DATE_NOW} 1.8s steps(9) ${_options.start} 1 normal both, 
                            blinkTextCursor_${DATE_NOW} 0.6s steps(66) infinite normal; 
                        }`;
                    appenToHead(cssContext, id);
                }
                function addCommonStyle() {
                    const cssContext = `.dnba-text-typing_${DATE_NOW} { display: inline-block; max-width: initial !important; width: initial !important; }
            .dnba-check-width_1line_${DATE_NOW} {white-space: nowrap !important;}
            .dnba-text-typing_${DATE_NOW} * { display: inline-block; border-right-style: solid; white-space: nowrap; overflow: hidden; }
            .dnba-text-typing_${DATE_NOW} > p {
                padding: 0 !important; margin: 0 !important; 
                border-left: none !important; border-top: none !important; border-bottom: none !important; 
                position: initial !important; float: initial !important;
            }
            @keyframes typewriter_${DATE_NOW} { from { width: 0 } to { width: 100% } }
            @keyframes endtyping_${DATE_NOW} {
                0% { border-right-width: 2px } 99% { border-right-width: 2px }
                100% { border-right-width: 0 }
            }
            @keyframes blinkTextCursor_${DATE_NOW} {
                from { border-right-color: ${_options.cursorColor} } to { border-right-color: transparent }
            }`;
                    appenToHead(cssContext, `dnba-style-texting-common_${DATE_NOW}`);
                }
                function appenToHead(css, id) {
                    const head = document.head || document.getElementsByTagName('head')[0],
                        style = document.createElement('style');
                    if (id) style.id = id;
                    head.appendChild(style);
                    if (style.styleSheet) {              // This is required for IE8 and below.
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(document.createTextNode(css));
                    }
                }
            }
            function isWidthOverView(node, maxWidth) {
                node.classList.add(`dnba-check-width_1line_${DATE_NOW}`);
                const isOver = node.scrollWidth > maxWidth;
                node.classList.remove(`dnba-check-width_1line_${DATE_NOW}`);
                if (isOver) return true;
                return false;
            }
            function addOrserver(node, callback) {                               // Create an observer instance linked to the callback function
                const observer = new MutationObserver(function (mutationsList) { // Callback function to execute when mutations are observed
                    for (const mutation of mutationsList) {                      // Use traditional 'for loops' for IE 11
                        if (mutation.type === 'childList') {
                            callback(mutation);
                        }
                    }
                });
                observer.observe(node, { childList: true, subtree: true });      // Start observing the target node for configured mutations
                return observer;
            }
            function canAddAnimation(mutation) {
                const target = mutation.target;
                if (target.className.includes(`dnba-type-running_${DATE_NOW}`) && mutation.addedNodes.length == 1 && mutation.removedNodes.length) {
                    target.classList.remove(`dnba-type-running_${DATE_NOW}`);
                    return false;
                }
                return true;
            }
            function addAnimation(node) {
                if (isWidthOverView(node, window.outerWidth)) return;
                if (node.className.includes(`dnba-type-running_${DATE_NOW}`)) return;
                const text = node.innerText;
                node.innerHTML = '';

                const className = updateStyle(text, callBackEnd);

                addChildTag(node, text, className);

                node.classList.add(`dnba-type-running_${DATE_NOW}`);
                function callBackEnd() {
                    node.style.height = `${node.offsetHeight}px`;
                    node.innerHTML = text;
                }
            }
            function addChildTag(node, text, className) {
                const p = document.createElement('p');
                const textnode = document.createTextNode(text);
                p.appendChild(textnode);
                p.classList.add(className);
                node.appendChild(p);
            }
            function roundeFloat(num) {
                return +(num.toFixed(3));
            }
            function updateStyle(text, callBackEnd) {
                const styleAnim = document.getElementById(`dnba-style-texting_${DATE_NOW}`);
                var className, durationEnd;

                styleAnim.innerHTML = getAnimTyping(text);

                setTimeout(callBackEnd, durationEnd * 1000 + 666);

                return className;

                function getAnimTyping(text) {
                    const steps = parseInt(text.length * 1.5);
                    const durationTexting = steps / 11;
                    durationEnd = durationTexting * 1.32;
                    const durationBlind = durationTexting / 4.5;
                    const typewriter = `typewriter_${DATE_NOW} ${roundeFloat(durationTexting)}s steps(${steps}) ${_options.start} 1 normal both`;
                    const endtyping = `endtyping_${DATE_NOW} ${roundeFloat(durationEnd)}s steps(${steps}) ${_options.start} 1 normal both`;
                    const blinkTextCursor = `blinkTextCursor_${DATE_NOW} ${roundeFloat(durationBlind)}s steps(${steps * 2}) infinite normal`;
                    className = `dnba-texting_${DATE_NOW}_${steps.toString().replace('.', '_')}`;
                    return `.${className} { animation: ${typewriter}, ${endtyping}, ${blinkTextCursor};}`;
                }
            }
        },
        remove: function () {
            if (window.bindTypewriter) {
                const list = document.querySelectorAll(`[data-typewriter="animation"]`);
                Array.prototype.forEach.call(list, function (item) {
                    item.classList.remove(`dnba-text-typing_${DATE_NOW}`);
                });

                var style = document.getElementById(`dnba-style-texting-common_${DATE_NOW}`);
                if (style) style.remove();
                style = document.getElementById(`dnba-style-texting_${DATE_NOW}`);
                if (style) style.remove();

                if (window.bindTypewriter.Observer) window.bindTypewriter.Observer.disconnect();        // stop observing
                delete window.bindTypewriter;
            }
        }
    }
    function validateParams(_options) {
        if (typeof _options.start != 'string') {
            throw new Error(`start must be string like "0.6s"`);
        }

        if (typeof _options.attribute != 'string') {
            throw new Error(`attribute must be string like: [data-typewriter="animation"]`);
        }

        if (typeof _options.cursorColor != 'string') {
            throw new Error(`attribute must be string like: white or #fff`);
        }
    }
}

module.exports = { bindTypewriter }