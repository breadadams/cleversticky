import { getElementHeight, getWindowHeight } from "./utils";
import { ElementType } from "./types";

export default class SmartSticky {
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
    this.scrollY = this.getScrollY();
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

  private getScrollY() {
    const y = window.scrollY;

    return y <= 0 ? 0 : y;
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

  private onWindowScroll = () => {
    const y = this.getScrollY();

    if (this.isTallerThanViewport()) {
      if (y !== this.scrollY) {
        const isScrollingDown = y > this.scrollY;
        const diff = Math.abs(this.scrollY - y);

        if (isScrollingDown) {
          this.top = Math.min(this.top + diff, this.stickyEnd);
        } else {
          this.top = Math.max(this.top - diff, 0);
        }

        this.applyTopStyle();
      }
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
      if (this.windowHeight !== windowHeight) {
        const windowIsLarger = windowHeight > this.windowHeight;
        const diff = Math.abs(this.windowHeight - windowHeight);

        if (windowIsLarger) {
          this.top = Math.min(this.top + diff, this.stickyEnd);
        } else {
          this.top = Math.max(this.top - diff, 0);
        }

        this.applyTopStyle();
      }
    } else {
      this.resetTop();
    }

    this.scrollY = this.getScrollY();
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
