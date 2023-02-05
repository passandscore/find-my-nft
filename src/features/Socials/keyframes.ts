import { keyframes } from "@mantine/core";

export const fadeIn = keyframes({
  "0%": { opacity: 0, transform: "translateY(100%)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

export const fadeOut = keyframes({
  "0%": { opacity: 1, transform: "translateY(0)" },
  "100%": { opacity: 0, transform: "translateY(100%)" },
});

export const spinRight = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const spinLeft = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(-360deg)" },
});

export const pulse = keyframes({
  "0%": { transform: "scale(1)" },
  "50%": { transform: "scale(1.2)" },
  "100%": { transform: "scale(1)" },
});

export const fadeLeft = keyframes({
  "0%": { opacity: 0, transform: "translateX(100%)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

export const fadeRight = keyframes({
  "0%": { opacity: 1, transform: "translateX(0)" },
  "100%": { opacity: 0, transform: "translateX(100%)" },
});

export const hideDisplay = keyframes({
  "100%": { display: "none" },
});
