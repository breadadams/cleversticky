import SmartSticky from "../src/index.ts";

const sticky = new SmartSticky("#sticky");

const toggleBtn = document.getElementById("toggle");

toggleBtn.addEventListener("click", () =>
  sticky.el?.classList.toggle("-small")
);

sticky.init();
