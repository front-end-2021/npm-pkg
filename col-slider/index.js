/** col-slider npm
 * install on git: git+https://github.com/visionmedia/express.git
 * or:             git+ssh://git@github.com/visionmedia/express.git
 * @param {*} options {
 *  mainWidth: number, 
 *  viewWidth: number, 
 *  height: number},
 *  slides: array[{ src }]
 *  }
 */

const colSlider = (options) => {
    let _options = {
        mainWidth: 240,
        viewWidth: 320,
        height: 426, // 4 : 3
        current: {
            bg: 'white',
            color: 'black',
            index: 0
        },
        slides: []
    };
    if (!!options)
        _options = Object.assign(_options, options);

    const DATE_NOW = Date.now();
    const DNB_COL_SLIDE = 'dnb-col-slide';
    const DNB_BOX = `cs-${DATE_NOW}`;
    const DNB_SUBVIEW = `cs-${DATE_NOW}-sub-view`;
    const DNB_MAINVIEW = `cs-${DATE_NOW}-main-view`;

    return {
        append: function (parent) {
            if (!_options.style) _options.style = addStyle();
            _options.element = genElements(parent);
            setDragScale();

            _options.element.addEventListener('mouseup', dnbColSliderDragEnd);
            _options.element.addEventListener('mouseleave', function dnbColSliderMouseOut(e) {
                dnbColSliderDragEnd();
            });

            const thisRef = this;
            return new Promise((resolve) => {
                // resolve(data);
            });
        }
    }
    function addStyle() {
        const css = `.dnb-col-slide > div[class^="cs-"] > * {
            box-sizing: border-box; background-color: green; border-left: 1px solid white;
          }
          .dnb-col-slide > div[class^="cs-"] > *:first-child { border-left: none; }
          .dnb-col-slide > div[class^="cs-"] > .active { background-color: black; }
          .dnb-col-slide .dnb-cs-item-bg {
            filter: blur(9px); -webkit-filter: blur(9px);
            -moz-filter: blur(9px); -o-filter: blur(9px);
            -ms-filter: blur(9px); position: absolute;
            top: -9px; left: -9px; z-index: 0;
          }`;
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        head.appendChild(style);
        if (style.styleSheet) { // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        return style;
    }
    function genElements(parent) {
        const _el = getElement(parent);
        genBoxAndItems(_el);
        return _el;
    }

    function getElement(parent) {
        if (!document) return 'This package support for web-app';
        let _e = document.querySelector(`.${DNB_COL_SLIDE}`);
        if (!!_e) {
            let _p = document.querySelector(parent);
            if (!!_p) {
                _p.appendChild(_e);
            }
            return _e;
        }
        _e = parent;
        if (typeof _e !== 'string') {
            _e = appendParent();
            return _e;
        }
        _e = document.querySelector(_e);
        if (!_e)
            _e = appendParent();
        else _e = appendParent(_e);
        return _e;
    }

    function appendParent(element) {
        let _e = document.createElement('SECTION');
        _e.setAttribute('id', `${DNB_COL_SLIDE}-${DATE_NOW}`);
        _e.setAttribute('class', `${DNB_COL_SLIDE}`);
        if (!element) document.body.appendChild(_e);
        else {
            element.appendChild(_e);
        }
        return _e;
    }

    function getItem(i) {
        if (_options.slides.length > i && _options.slides[i]) {
            return _options.slides[i];
        }
        else
            return null;
    }

    function setDragScale() {

        var wrap = document.querySelector(`.${DNB_BOX}`);
        var elmActive = wrap.getElementsByClassName('active');
        elmActive = elmActive[0];
        _options.ScaleDown = elmActive;

        _options.ScaleDown.addEventListener('mousedown', dnbColSliderDragStart);
        _options.ScaleDown.addEventListener('touchstart', dnbColSliderDragStart);
        _options.ScaleDown.addEventListener('touchend', dnbColSliderDragEnd);
        _options.ScaleDown.addEventListener('touchmove', dnbColSliderDragging);
    }

    function addTransitionAll() {
        if (!_options.ScaleDown.classList.contains('dnb-all-transition'))
            _options.ScaleDown.classList.add('dnb-all-transition');

        if (!_options.ScaleUp.classList.contains('dnb-all-transition'))
            _options.ScaleUp.classList.add('dnb-all-transition');
    }
    function clearTransitionAll() {
        const matches = document.querySelectorAll('.dnb-all-transition');
        matches.forEach(function (item) {
            item.classList.remove('dnb-all-transition');
        });
    }
    function dnbColSliderDragStart(e) {
        clearTransitionAll();
        e = e || window.event;
        e.preventDefault();

        if (e.type == 'touchstart') {
            _options.PosX1 = e.touches[0].clientX;
        } else {
            _options.PosX1 = e.clientX;
            _options.ScaleDown.addEventListener('mousemove', dnbColSliderDragging);
        }
        _options.WidthMax = getMainWidth();
        _options.WidthBox = getMainWidth() + getSubItemWidth();
    }
    function dnbColSliderDragging(e) {
        e = e || window.event;
        if (e.type == 'touchmove') e = e.touches[0];

        var _dX = e.clientX - _options.PosX1;
        if (_dX < 0) {
            _options.ScaleUp = _options.ScaleDown.nextSibling;
        } else if (_dX > 0) {
            _options.ScaleUp = _options.ScaleDown.previousSibling;
        }
        _dX = _options.WidthMax - Math.abs(_dX) * 0.9;
        _dX = _dX / _options.WidthMax;
        (_dX < 0.25) && (_dX = 0.25)

        if (!!_options.ScaleDown && !!_options.ScaleUp) {
            _options.deltaX = _dX;
            if (_dX < 0.45) {
                dnbColSliderDragEnd();
                return;
            }
            _dX = _options.WidthMax * _dX;
            setWidth(_options.ScaleDown, _dX);
            setWidth(_options.ScaleUp, _options.WidthBox - _dX);
        }
    }
    function dnbColSliderDragEnd(e) {
        if (_options.ScaleDown == undefined) return;
        if (!!e && e.type == 'mouseup') {
            _options.ScaleDown.removeEventListener('mousemove', dnbColSliderDragging);
        }

        if (_options.ScaleUp == undefined) return;
        addTransitionAll();
        if (_options.deltaX == undefined) return;

        if (_options.deltaX < 0.45) {
            setWidth(_options.ScaleDown, getSubItemWidth());
            setWidth(_options.ScaleUp, _options.WidthMax);
            _options.ScaleDown.classList.remove('active');
            _options.ScaleUp.classList.add('active');
        } else {
            setWidth(_options.ScaleDown, _options.WidthMax);
            setWidth(_options.ScaleUp, getSubItemWidth());
        }

        _options.ScaleDown.removeEventListener('touchmove', dnbColSliderDragging);
        _options.ScaleDown.removeEventListener('touchend', dnbColSliderDragEnd);
        _options.ScaleDown.removeEventListener('touchstart', dnbColSliderDragStart);
        _options.ScaleDown.removeEventListener('mousedown', dnbColSliderDragStart);
        _options.ScaleDown.removeEventListener('mousemove', dnbColSliderDragging);

        _options.ScaleDown = _options.ScaleUp = _options.deltaX = undefined;
        setDragScale();
    }

    function getMainWidth() {
        let _main = _options.viewWidth * 0.75;
        return Math.ceil(_main);
    }

    function getSubItemWidth() {
        let _w = _options.viewWidth - getMainWidth();
        return _w / (sumViews() - 1);
    }
    function getHeight() {
        return _options.height;
    }

    function sumViews() {
        return _options.slides.length;
    }
    function setWidth(element, width) {
        if (!element) return;
        element.style.minWidth = `${width}px`;
        element.style.maxWidth = `${width}px`;
    }
    function setStyle(element, isMain) {
        element.style.overflow = 'hidden';
        element.style.display = 'inline-block';
        element.style.cursor = 'pointer';
        element.style.position = 'relative';
        var _h = getHeight();
        element.style.minHeight = `${_h}px`;
        element.style.maxHeight = `${_h}px`;
        var _w = getSubItemWidth();
        if (isMain) {
            _w = getMainWidth();
        }
        setWidth(element, _w);
    }
    function genViewMainAndSubs(parent) {
        const _sIndex = 0;

        for (let i = 0, len = sumViews(); i < len; i++) {
            let _e = document.createElement('DIV');
            _e.setAttribute('data-index', `${i}`);
            setStyle(_e, i === _sIndex);
            if (i === _sIndex) {
                _e.setAttribute('class', `${DNB_MAINVIEW} cs-item-${DATE_NOW} active`);
                parent.appendChild(_e);
            } else {
                _e.setAttribute('class', `${DNB_SUBVIEW} cs-item-${DATE_NOW}`);
                parent.appendChild(_e);
            }
            getBg(getItem(i), _e);
            getImg(getItem(i), _e);
        }
    }
    function getBg(img, parent) {
        let _e = document.createElement('DIV');
        _e.setAttribute('class', 'dnb-cs-item-bg');
        _e.style.backgroundImage = `url(${img.src})`;
        _e.style.width = `${getMainWidth() + 23}px`;
        _e.style.height = `${getHeight() + 23}px`;
        parent.appendChild(_e);
    }
    function getImg(img, parent) {
        let _e = document.createElement('IMG');
        _e.src = img.src;
        _e.alt = img.alt || 'image for preview';
        _e.style.index = 1;
        _e.style.position = 'relative';
        _e.style.maxHeight = `${getHeight()}px`;
        _e.style.maxWidth = `${getMainWidth()}px`;
        parent.appendChild(_e);
    }
    function genBoxAndItems(parent) {
        let _e = document.createElement('DIV');
        _e.setAttribute('class', `${DNB_BOX}`);
        let _br = _options.border || 6;
        _e.style.borderRadius = `${_br}px`;
        _e.style.overflow = 'hidden';
        _e.style.height = `${getHeight()}px`;
        parent.appendChild(_e);
        genViewMainAndSubs(_e);
    }
}

module.exports = { colSlider }