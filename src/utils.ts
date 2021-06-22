import { ElementType } from "./types";

export const getElementHeight = (el: ElementType) => el?.clientHeight ?? 0;

export const getScrollY = () => Math.max(window?.scrollY ?? 0, 0);

export const getWindowHeight = () => window?.innerHeight ?? 0;
