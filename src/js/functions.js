
// http://usejsdoc.org/

/**
 *  @param {object} elem - element selector
 *  @param {string} cls  - element class
 */

function addClass(elem, cls) {

  if (elem.classList){
    elem.classList.add(cls);

  } else {
    var currentClass = elem.className;

    if(currentClass.indexOf(cls) < 1){
      elem.className += ' ' + cls;
    }
  }
}


/**
 *  @param {object} elem - element selector
 *  @param {string} cls  - element class
 */

function removeClass(elem, cls) {

  if (elem.classList){
    elem.classList.remove(cls);

  } else {
    var currentClass = elem.className;

    if(currentClass.indexOf(cls) > 1){
      newClass = currentClass.replace(cls,'');
      elem.className = newClass;
    }
  }
}


/**
 *  @param {object} elem - element selector
 *  @param {string} cls  - element class
 */

function toggleClass(elem, cls) {

  if (elem.classList){
    elem.classList.toggle(elemClass);

  } else {
    var currentClass = elem.className;

    if(currentClass.indexOf(elemClass) > -1){
      newClass = currentClass.replace(elemClass,"");

    } else {
      newClass = currentClass + " " + elemClass;
    }
    elem.className = newClass;
  }
}


/**
 *  @param {object} elem - element selector
 *  @param {string} cls  - element class
 */

function hasClass(elem, cls) {

  var currentClass = elem.className;

  if(currentClass.indexOf(cls) >= 0){
    return true;
  }
}


/**
 *  @param {object} elem - element selector
 *  @param {number} nth  - parent
 */

function closest(elem, nth) {

	return nth === 0 ? elem : closest(elem.parentNode, nth - 1);
}


/**
 *  @param {string}   url     - endpoint
 *  @param {function} fnc     - xhr.addEventListener('load', function(){...});
 *  @param {boolean}  [async] - true asynchronous (default value) and false synchronous
 */

function ajaxGet(url, fnc, async) {

  var xhr = new XMLHttpRequest();

  async = (async === undefined) ? true : async;
  xhr.open('GET', url, async);

  xhr.addEventListener('load', fnc);

  xhr.addEventListener('loadstart', function(){
    // before send
  });

  xhr.addEventListener('loadend', function(){
    // complete
  });

  xhr.addEventListener('error', function(){
    // error
  });

  xhr.send();
}


/**
 *  @param {string}   url           - endpoint
 *  @param {string}   datas         - form data
 *  @param {function} fnc           - xhr.addEventListener('load', function(){...});
 *  @param {string}   [contentType] - 'text/html', 'application/json' ...
 *  @param {boolean}  [async]       - true asynchronous (default value) and false synchronous
 */

function ajaxPost(url, datas, fnc, contentType, async) {

  var xhr = new XMLHttpRequest();

  async = (async === undefined) ? true : async;
  xhr.open('POST', url, async);

  contentType = (contentType === undefined) ? 'application/x-www-form-urlencoded; charset=UTF-8' : contentType;
  xhr.setRequestHeader('Content-Type', contentType);

  xhr.addEventListener('load', fnc);

  xhr.addEventListener('loadstart', function(){
    // before send
  });

  xhr.addEventListener('loadend', function(){
    // complete
  });

  xhr.addEventListener('error', function(){
    // error
  });

  xhr.send(datas);
}


/**
 *  @param {object} form - form selector
 */

function serialize(form) {

  var result = [];

  if (typeof form === 'object' && form.nodeName === 'FORM')
    Array.prototype.slice.call(form.elements).forEach(function(control) {
      if (
        control.name &&
        !control.disabled &&
        ['file', 'reset', 'submit', 'button'].indexOf(control.type) === -1
      )

      if (control.type === 'select-multiple')
        Array.prototype.slice.call(control.options).forEach(function(option) {
          if (option.selected)
              result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(option.value));
        });

      else if (
        ['checkbox', 'radio'].indexOf(control.type) === -1 ||
        control.checked
      ) result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(control.value));
    });
    return result.join('&').replace(/%20/g, '+');
}


/**
 *  @param {object} elem    - element selector
 *  @param {string} display - block (default value) or inline-block
 */

function fadeIn(elem, display) {

  if(window.requestAnimationFrame){

    elem.style.opacity = 0;
    elem.style.display = display || 'block';

    (function fade() {
      var val   = parseFloat(elem.style.opacity),
          check = ((val += 0.1) > 1);

      if (!check) {
        elem.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();

  } else {
    elem.style.display = display || 'block';
  }
}


/**
 *  @param {object} elem    - element selector
 */

function fadeOut(elem) {

  if(window.requestAnimationFrame){

    elem.style.opacity = 1;

    (function fade() {

      if ((elem.style.opacity -= 0.1) < 0) {
        elem.style.display = 'none';

      } else {
        requestAnimationFrame(fade);
      }
    })();

  } else {
    elem.style.display = 'none';
  }
}


/**
 *  @param {object} elem    - element selector
 */

function isHidden(elem) {

  var style       = window.getComputedStyle(elem),
      display     = style.getPropertyValue('display'),
      visibility  = style.getPropertyValue('visibility'),
      opacity     = style.getPropertyValue('opacity');

  if(display === 'none' || visibility === 'hidden' || opacity === '0'){
    return true;
  }
}


/**
 *  @param {object} elem    - element selector
 */

function isVisible(elem) {

  if(!isHidden(elem)){
    return true;
  }
}