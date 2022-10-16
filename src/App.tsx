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
      // if (v instanceof Node) return "-Node-";
      if (v instanceof HTMLElement) {
        return v.outerHTML.split(">")[0] + ">";
      }
      if (v instanceof Window) return "-Window-";
      if (v instanceof Function) return "-Function-";
      return v;
    },
    " "
  );
}

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
    console.log('selector', selector)
    if (!selector.startsWith("html")) {
      // skip html
      path.unshift(selector);
    }
    el = el.parentNode;
  }
  return path.join(" > ");
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
  };

  useEffect(() => {
    window.addEventListener("click", clickHandler);
    return () => {
      window.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button
        onClick={() => {
          console.log("button clicked");
        }}
      >
        Button
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
