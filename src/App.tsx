import { useEffect } from "react";

// manually serialize
function stringifyEvent(e: any) {
  const obj = {} as any;
  for (let k in e) {
    obj[k] = e[k];
  }
  return JSON.stringify(
    obj,
    (k, v) => {
      if (k === "path") {
        // abort path property since it can be long
        return
      }
      if (v instanceof Node) return "-Node-";
      // if (v instanceof HTMLElement) {
      //   return v.outerHTML.split(">")[0] + ">";
      // }
      if (v instanceof Window) return "-Window-";
      if (v instanceof Function) return "-Function-";
      return v;
    },
    " "
  );
}

// handles duplicates well
function cssPath(el: any) {
  if (!(el instanceof Element)) return;
  var path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    var selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += "#" + el.id;
    } else {
      var sib = el,
        nth = 1;
      while (
        sib.nodeType === Node.ELEMENT_NODE &&
        (sib = sib.previousSibling) &&
        nth++
      );
      selector += ":nth-child(" + nth + ")";
    }
    // console.log('selector', selector)
    if (!selector.startsWith("html")) {
      // skip html
      path.unshift(selector);
    }
    el = el.parentNode;
  }
  return path.join(" > ");
}

// handles duplicates well
function cssPathUsingClass(el: any) {
  if (!(el instanceof Element)) return;
  var path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    var selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += "#" + el.id;
    } else if ([].slice.call(el.classList).join('.')) {
      selector += "." + [].slice.call(el.classList).join('.')
    } else {
      var sib = el,
        nth = 1;
      while (
        sib.nodeType === Node.ELEMENT_NODE &&
        (sib = sib.previousSibling) &&
        nth++
      );
      selector += ":nth-child(" + nth + ")";
    }
    // console.log('selector', selector)
    if (!selector.startsWith("html")) {
      // skip html
      path.unshift(selector);
    }
    el = el.parentNode;
  }
  return path.join(" > ");
}

function cssPathUsingClassAndIndex(el: any) {
  if (!(el instanceof Element)) return;
  var path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    var selector = el.nodeName.toLowerCase();
    const classList = [].slice.call(el.classList).join('.')
    if (classList) {
      selector += "." + classList
    }
    if (el.id) {
      selector += "#" + el.id;
    } else {
      var sib = el,
        nth = 1;
      while (
        sib.nodeType === Node.ELEMENT_NODE &&
        (sib = sib.previousSibling) &&
        nth++
      );
      selector += ":nth-child(" + nth + ")";
    }
    // console.log('selector', selector)
    if (!selector.startsWith("html")) {
      // skip html
      path.unshift(selector);
    }
    el = el.parentNode;
  }
  return path.join(" > ");
}

// doesn't handle duplicates well
function cssPathUsingClassAndID(el: any) {
  if (!(el instanceof Element)) return;
  var path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    var selector = el.nodeName.toLowerCase();
    if ([].slice.call(el.classList).join('.')) {
      selector += "." + [].slice.call(el.classList).join('.')
    }
    if (el.id) {
      selector += "#" + el.id;
    }
    // console.log('selector', selector)
    if (!selector.startsWith("html")) {
      // skip html
      path.unshift(selector);
    }
    el = el.parentNode;
  }
  return path.join(" > ");
}

// doesn't handle duplicates well
function altSelector(originalEl: any) {
  var el = originalEl;
  if (el instanceof Node) {
    // Build the list of elements along the path
    var elList = [];
    do {
      if (el instanceof Element) {
        var classString = el.classList ? [].slice.call(el.classList).join('.') : '';
        var elementName = (el.tagName ? el.tagName.toLowerCase() : '') + 
            (classString ? '.' + classString : '') + 
            (el.id ? '#' + el.id : '');
        if (elementName) elList.unshift(elementName);
      }
      el = el.parentNode
    } while (el != null);
    // Get the stringified element object name
    var objString = originalEl.toString().match(/\[object (\w+)\]/);
    var elementType = objString ? objString[1] : originalEl.toString();
    var cssString = elList.join(' > ');
    // Return the CSS path as a string, prefixed with the element object name
    // return cssString ? elementType + ': ' + cssString : elementType;
    return cssString
  }
}

export default function App() {
  const clickHandler = (event: MouseEvent) => {
    console.log("event", event);
    console.log({
      windowHeight: window?.innerHeight,
      windowWidth: window?.innerWidth,
      screenHeight: window.screen.height,
      screenWidth: window.screen.width,
      event: stringifyEvent(event),
      location: JSON.stringify(window.location)
    });
    console.log(event.target);
    console.log(cssPath(event.target));
    // console.log(cssPathUsingClass(event.target));
    const sel = cssPathUsingClassAndIndex(event.target)
    console.log(sel);
    console.log(sel?.replace(/(\..+?:)/gm, ':')); // remove classes (now same as cssPath)
    // console.log(cssPathUsingClassAndID(event.target));
    // console.log(altSelector(event.target));
  };
  const hoverHandler = (event: MouseEvent) => {
    if (event.target instanceof Element && ["A", "BUTTON"].includes(event.target.tagName)) {
      console.log("hover event", event);
      console.log({
        windowHeight: window?.innerHeight,
        windowWidth: window?.innerWidth,
        screenHeight: window.screen.height,
        screenWidth: window.screen.width,
        event: stringifyEvent(event),
        location: JSON.stringify(window.location)
      });
      console.log(event.target);
      console.log(cssPath(event.target));
      const sel = cssPathUsingClassAndIndex(event.target)
      console.log(sel);
      console.log(sel?.replace(/(\..+?:)/gm, ':')); // remove classes (now same as cssPath)
      const mouseLeaveHandler: EventListener = (evt: Event) => {
        evt.target?.removeEventListener('mouseleave', mouseLeaveHandler)
        console.log('mouse left')
      }
      event.target.addEventListener('mouseleave', mouseLeaveHandler)
    }
  };

  useEffect(() => {
    window.addEventListener("click", clickHandler);
    window.addEventListener("mouseover", hoverHandler);
    window.addEventListener('load', (e) => {
      console.log('load', e, window.location.pathname)
    })
    return () => {
      window.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div className="App test hey">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button
        onClick={() => {
          console.log("button clicked");
        }}
      >
        Button0
      </button>
      <button
        onClick={() => {
          console.log("button clicked");
        }}
      >
        Button1
      </button>
      <div
        onClick={() => {
          console.log("div clicked");
        }}
      >
        div
      </div>
      <a href="#">a tag</a>
    </div>
  );
}
