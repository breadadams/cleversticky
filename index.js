class SmartSticky {
  constructor(el) {
    this.scrollY = this.getScrollY();
    this.windowHeight = this.getWindowHeight();

    this.el = typeof el !== "string" ? el : document.querySelector(el);
    this.elHeight = this.getElHeight();
    this.resizeObserver = null;
    this.stickyEnd = this.getStickyEnd();
    this.top = 0;
  }

  getElHeight() {
    return this.el?.clientHeight ?? 0;
  }

  getScrollY() {
    const y = window.scrollY;

    return y <= 0 ? 0 : y;
  }

  getStickyEnd(h) {
    const windowHeight = typeof h === "undefined" ? this.windowHeight : h;
    return (windowHeight - this.elHeight) * -1;
  }

  getWindowHeight() {
    return window?.innerHeight ?? 0;
  }

  setTopStyle(top) {
    this.el.style.top = top;
  }

  applyTopStyle() {
    this.setTopStyle(`${this.top * -1}px`);
  }

  clearTopStyle() {
    this.setTopStyle("");
  }

  onWindowScroll = () => {
    const y = this.getScrollY();

    if (this.elHeight > this.windowHeight) {
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
      this.clearTopStyle();
    }

    this.scrollY = y;
  };

  onWindowResize = () => {
    const windowHeight = this.getWindowHeight();

    this.elHeight = this.getElHeight();
    this.stickyEnd = this.getStickyEnd(windowHeight);

    if (this.elHeight > windowHeight) {
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
      this.clearTopStyle();
    }

    this.scrollY = this.getScrollY();
    this.windowHeight = windowHeight;
  };

  onElementResize = () => {
    this.elHeight = this.getElHeight();
    this.windowHeight = this.getWindowHeight();
    this.stickyEnd = this.getStickyEnd();
  };

  init() {
    if (this.el) {
      window.addEventListener("resize", this.onWindowResize);
      window.addEventListener("scroll", this.onWindowScroll);

      this.resizeObserver = new ResizeObserver(this.onElementResize);
      this.resizeObserver.observe(this.el);
    }
  }

  destroy() {
    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("scroll", this.onWindowScroll);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.el) {
      this.clearTopStyle();
    }
  }
}

const ss = new SmartSticky("#sticky");

ss.init();
