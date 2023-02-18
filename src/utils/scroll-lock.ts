const $body: HTMLBodyElement = document.querySelector("body") as HTMLBodyElement;
let scrollPosition: number = 0;

export default {
  enable() {
    scrollPosition = window.scrollY;
    $body.style.overflow = "hidden";
    $body.style.position = "fixed";
    $body.style.top = `-${scrollPosition}px`;
    $body.style.width = "100vw";
  },
  disable() {
    $body.style.removeProperty("overflow");
    $body.style.removeProperty("position");
    $body.style.removeProperty("top");
    $body.style.removeProperty("width");
    window.scrollTo(0, scrollPosition);
  },
};
