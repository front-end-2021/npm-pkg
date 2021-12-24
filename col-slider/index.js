/** col-slider npm
 * install on git: git+https://github.com/visionmedia/express.git
 * or:             git+ssh://git@github.com/visionmedia/express.git
 * 
 * @param mainWidth: undefined || number || string  = 'xx%',
 * @param viewWidth: undefined (100%) || number (the size of view),
 * @param height: undefined (426px) || number,
 * @param slides: array[{ src: 'string }]
 * @param transitionTime: number 0 -> 1
 */

const colSlider = (options) => {
    let _options = {
        //mainWidth: 240,
        height: 426, // 4 : 3
        transitionTime: 0.45,
        slides: []
    };
    if (!!options)
        _options = Object.assign(_options, options);

    const DATE_NOW = Date.now();
    const DNB_COL_SLIDE = 'dnb-col-slide';
    const DNB_BOX = `cs-${DATE_NOW}`;
    const DNB_SUBVIEW = `cs-${DATE_NOW}-sub-view`;
    const DNB_MAINVIEW = `cs-${DATE_NOW}-main-view`;
    const DNB_ITEM = `cs-item-${DATE_NOW}`;
    const DNB_ITEM_BG = `dnb-cs-${DATE_NOW}-item-bg`;

    return {
        append: function (parent) {
            if (!document) return;//'This package support for web-app';

            if (!_options.style) _options.style = addStyle(parent);
            _options.element = genElements(parent);
            setDragScale();

            _options.element.addEventListener('mouseup', dnbColSliderDragEnd);
            _options.element.addEventListener('mouseleave', function (e) {
                dnbColSliderDragEnd(e);
            });
        }
    }
    function addStyle(parent) {
        if (!document) return;
        var tTime = _options.transitionTime;
        tTime = typeof tTime == 'number' ? tTime : 0.45;
        tTime = tTime < 0 ? 0.45 : (tTime > 3 ? 3 : tTime);
        const css = `.${DNB_COL_SLIDE} .${DNB_ITEM} {box-sizing: border-box;background-color: green;border-left: 1px solid white;position:relative}
        .${DNB_COL_SLIDE} .${DNB_ITEM} {overflow:hidden;display:inline-block;min-height:${getHeight()}px;max-height:${getHeight()}px;}
        .${DNB_COL_SLIDE} .dnb-all-transition {transition: all ${tTime}s cubic-bezier(0.25,1,0.5,1);}
        .${DNB_COL_SLIDE} .${DNB_ITEM}:first-child {border-left: none;}
        .${DNB_COL_SLIDE} .${DNB_ITEM}.active {background-color: black;}
        .${DNB_COL_SLIDE} .${DNB_ITEM_BG} {filter:blur(12px);-webkit-filter:blur(12px);-moz-filter:blur(12px);-o-filter:blur(12px);
          -ms-filter:blur(12px);position: absolute;top: -9px;left: -9px;z-index: 0;width: 100%;height:100%;transform: scale(1.2);}`;
        var p = document.querySelector(parent);// document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        p.appendChild(style);
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
        _options.MWidthPx = getM_WidthPx();
        _options.WBoxPx = getM_WidthPx() + getSub_WidthPx();
    }
    function dnbColSliderDragging(e) {
        e = e || window.event;
        if (e.type == 'touchmove') e = e.touches[0];

        var _dX = e.clientX - _options.PosX1;
        if (_dX < 0) {
            initScaleUp(_options.ScaleDown.nextSibling);
        } else if (_dX > 0) {
            initScaleUp(_options.ScaleDown.previousSibling);
        }
        _dX = _options.MWidthPx - Math.abs(_dX) * 1.38;
        _dX = _dX / _options.MWidthPx;
        (_dX < 0.25) && (_dX = 0.25)

        if (!!_options.ScaleDown && !!_options.ScaleUp) {
            _options.deltaX = _dX;
            if (_dX < 0.45) {
                dnbColSliderDragEnd();
                return;
            }
            _dX = _options.MWidthPx * _dX;
            setWidthPx(_options.ScaleDown, _dX);
            setWidthPx(_options.ScaleUp, _options.WBoxPx - _dX);
        }
    }
    function initScaleUp(slibling) {
        if(_options.ScaleUp) {
            setWidth(_options.ScaleUp, getSubWidth());
        }
        _options.ScaleUp = slibling;
    }
    function dnbColSliderDragEnd(e) {
        if (_options.ScaleDown == undefined) return;
        if (!!e) {
            if (e.type == 'mouseup' || e.type == 'mouseleave')
                _options.ScaleDown.removeEventListener('mousemove', dnbColSliderDragging);
        }

        if (_options.ScaleUp == undefined) return;
        addTransitionAll();
        if (_options.deltaX == undefined) return;

        if (_options.deltaX < 0.45) {
            setWidth(_options.ScaleDown, getSubWidth());
            setWidth(_options.ScaleUp, getM_Width());
            _options.ScaleDown.classList.remove('active');
            var clsN = _options.ScaleDown.className.replace(`${DNB_MAINVIEW}`, `${DNB_SUBVIEW}`);
            _options.ScaleDown.className = clsN;

            _options.ScaleUp.classList.add('active');
            clsN = _options.ScaleUp.className.replace(`${DNB_SUBVIEW}`, `${DNB_MAINVIEW}`);
            _options.ScaleUp.className = clsN;
        } else {
            setWidth(_options.ScaleDown, getM_Width());
            setWidth(_options.ScaleUp, getSubWidth());
        }

        _options.ScaleDown.removeEventListener('touchmove', dnbColSliderDragging);
        _options.ScaleDown.removeEventListener('touchend', dnbColSliderDragEnd);
        _options.ScaleDown.removeEventListener('touchstart', dnbColSliderDragStart);
        _options.ScaleDown.removeEventListener('mousedown', dnbColSliderDragStart);
        _options.ScaleDown.removeEventListener('mousemove', dnbColSliderDragging);

        _options.ScaleDown = _options.ScaleUp = _options.deltaX = undefined;
        setDragScale();
    }
    function getUnit() {
        if(typeof _options.mainWidth == 'undefined') return '%';
        if(typeof _options.mainWidth !== 'string') return 'px';
        if(_options.mainWidth.indexOf('%') < 0) return 'px';
        return '%';
    }
    function getM_Width() {
        let _main = _options.mainWidth;
        if(typeof _main == 'undefined') return 75;
        if(typeof _main == 'string' && _main.indexOf('%') > -1) {
            _main = parseInt(_main);
            (_main > 100 || _main < 0) && (_main = 100);
            return Math.ceil(_main);;
        }
        _main = getV_Width() * 0.75;
        if (typeof _options.mainWidth == 'number') _main = _options.mainWidth;
        return Math.ceil(_main);
    }
    function getM_WidthPx(){
        let d = document.querySelector(`.${DNB_ITEM}.active`);
        return d.clientWidth;
    }
    function getSub_WidthPx() {
        let d = document.querySelector(`.${DNB_SUBVIEW}.${DNB_ITEM}`);
        return d.clientWidth;
    }
    function getV_Width(){
        let w = _options.viewWidth;
        if(typeof w === 'number') return w;
        if(typeof w === 'string' && w.indexOf('%') > -1) {
            w = parseInt(w);
            (w > 100 || w < 0) && (w = 100);
            return w;   // 0 -> 100%
        };
        if(typeof w === 'undefined' && getUnit() == '%') return 100;
        return 320;
    }
    function getSubWidth() {
        let _w;
        if(getUnit() == '%') {
            _w = 100 - getM_Width();
            return _w / (sumViews() - 1);
        }
        _w = getV_Width() - getM_Width();
        return _w / (sumViews() - 1);
    }
    function getHeight() {
        return _options.height;
    }
    function sumViews() {
        return _options.slides.length;
    }
    function setWidthPx(element, width) {
        if (!element) return;
        element.style.minWidth = `${width}px`;
        element.style.maxWidth = `${width}px`;
    }
    function setWidth(element, width) {
        if (!element) return;
        element.style.minWidth = `${width}${getUnit()}`;
        element.style.maxWidth = `${width}${getUnit()}`;
    }
    function setStyle(element, isMain) {
        var _w = getSubWidth();
        if (isMain) {
            _w = getM_Width();
        }
        setWidth(element, _w);
    }
    function genViewMainAndSubs(parent) {
        const _sIndex = 0;
        let _e;
        for (let i = 0, len = sumViews(); i < len; i++) {
            _e = document.createElement('DIV');
            _e.setAttribute('data-index', `${i}`);
            setStyle(_e, i === _sIndex);
            if (i === _sIndex) {
                _e.setAttribute('class', `${DNB_ITEM} ${DNB_MAINVIEW} active`);
                parent.appendChild(_e);
            } else {
                _e.setAttribute('class', `${DNB_ITEM} ${DNB_SUBVIEW}`);
                parent.appendChild(_e);
            }
            getBg(getItem(i), _e);
            _e = renderFlexBox(_e);
            getImg(getItem(i), _e);
        }
    }
    function getBg(img, parent) {
        let _e = document.createElement('DIV');
        _e.setAttribute('class', DNB_ITEM_BG);
        _e.style.backgroundImage = `url(${img.src})`;
        parent.appendChild(_e);
    }
    function renderFlexBox(parent) {
        let _e = document.createElement('DIV');
        _e.style.position = 'relative';
        _e.style.display = 'flex';
        _e.style.alignItems = 'center';
        _e.style.justifyContent = 'space-around';
        _e.style.height = `${getHeight()}px`;
        parent.appendChild(_e);
        return _e;
    }
    function getImg(img, parent) {
        let _e = document.createElement('IMG');
        _e.src = img.src;
        _e.alt = img.alt || 'image for preview';
        _e.style.index = 1;
        _e.style.borderRadius = '3px';
        _e.style.maxHeight = `${getHeight()}px`;
        parent.appendChild(_e);
    }
    function genBoxAndItems(parent) {
        let _e = document.createElement('DIV');
        _e.setAttribute('class', `${DNB_BOX}`);
        let _br = _options.border || 6;
        _e.style.borderRadius = `${_br}px`;
        _e.style.overflow = 'hidden';
        _e.style.height = `${getHeight()}px`;
        if(typeof _options.viewWidth == 'number') {
            _e.style.width = `${_options.viewWidth}px`;
        }
        parent.appendChild(_e);
        genViewMainAndSubs(_e);
    }
}

module.exports = { colSlider }