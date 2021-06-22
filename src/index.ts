import { getElementHeight, getScrollY, getWindowHeight } from "./utils";
import { ElementType } from "./types";

export default class CleverSticky {
  private _el: ElementType;
  private elHeight: number;
  private resizeObserver: ResizeObserver | null;
  private scrollY: number;
  private stickyEnd: number;
  private top: number;
  private windowHeight: number;

  get el(): ElementType {
    return this._el;
  }

  constructor(element: string | ElementType) {
    this.scrollY = getScrollY();
    this.windowHeight = getWindowHeight();

    this._el =
      typeof element !== "string" ? element : document.querySelector(element);
    this.elHeight = this.getElHeight();
    this.resizeObserver = null;
    this.stickyEnd = this.getStickyEnd();
    this.top = 0;
  }

  private getElHeight() {
    return getElementHeight(this._el);
  }

  private getStickyEnd(h?: number) {
    const windowHeight = typeof h === "undefined" ? this.windowHeight : h;
    return (windowHeight - this.elHeight) * -1;
  }

  private setTopStyle(top: string) {
    if (this._el) {
      this._el.style.top = top;
    }
  }

  private applyTopStyle() {
    this.setTopStyle(`${this.top * -1}px`);
  }

  private resetTop() {
    this.setTopStyle("");
    this.top = 0;
  }

  private isTallerThanViewport() {
    return this.elHeight > this.windowHeight;
  }

  private calculateNewTop(newValue: number, existingValue: number) {
    const addToTop = (add: number) => Math.min(this.top + add, this.stickyEnd);
    const subtractFromTop = (sub: number) => Math.max(this.top - sub, 0);

    if (newValue !== existingValue) {
      const isAddition = newValue > existingValue;
      const diff = Math.abs(existingValue - newValue);

      this.top = (isAddition ? addToTop : subtractFromTop)(diff);
      this.applyTopStyle();
    }
  }

  private onWindowScroll = () => {
    const y = getScrollY();

    if (this.isTallerThanViewport()) {
      this.calculateNewTop(y, this.scrollY);
    } else {
      this.resetTop();
    }

    this.scrollY = y;
  };

  private onWindowResize = () => {
    const windowHeight = getWindowHeight();

    this.elHeight = this.getElHeight();
    this.stickyEnd = this.getStickyEnd(windowHeight);

    if (this.isTallerThanViewport()) {
      this.calculateNewTop(windowHeight, this.windowHeight);
    } else {
      this.resetTop();
    }

    this.scrollY = getScrollY();
    this.windowHeight = windowHeight;
  };

  private onElementResize = () => {
    this.elHeight = this.getElHeight();
    this.stickyEnd = this.getStickyEnd();

    if (!this.isTallerThanViewport()) {
      this.resetTop();
    }
  };

  init() {
    if (this._el) {
      window.addEventListener("resize", this.onWindowResize);
      window.addEventListener("scroll", this.onWindowScroll);

      this.resizeObserver = new ResizeObserver(this.onElementResize);
      this.resizeObserver.observe(this._el);
    }
  }

  destroy() {
    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("scroll", this.onWindowScroll);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this._el) {
      this.resetTop();
    }
  }
}
