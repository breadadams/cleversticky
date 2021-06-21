import CleverSticky from "../src/index.ts";

const cs = new CleverSticky("#sticky");

const toggleBtn = document.getElementById("toggle");

toggleBtn.addEventListener("click", () => cs.el?.classList.toggle("-small"));

cs.init();
