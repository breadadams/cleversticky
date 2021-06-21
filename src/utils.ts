import { ElementType } from "./types";

export const getWindowHeight = () => window?.innerHeight ?? 0;

export const getElementHeight = (el?: ElementType) => el?.clientHeight ?? 0;
