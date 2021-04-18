export const isMobile = (width = "768px") => {
  return window.matchMedia(`(max-width: ${width})`).matches;
};
