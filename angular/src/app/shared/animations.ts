import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  group,
} from "@angular/animations";

export const staggerAnimation = trigger("staggerAnimation", [
  transition(":enter", [
    query(".stagger", [
      style({ opacity: 0, transform: "translateY(-30px)" }),
      stagger(100, [
        animate(
          ".6s cubic-bezier(0.1, 0.9, 0.2, 1)",
          style({ opacity: 1, transform: "translateY(0px)" })
        ),
      ]),
    ]),
  ]),
]);

export const navigationNewItem = trigger("navigationNewItem", [
  state("*", style({ opacity: 1, transform: "translateY(0%)" })),
  state("void", style({ opacity: 0, visibility: "hidden" })),
  transition("* => void", [
    group([
      animate("200ms 100ms ease-in-out", style({ opacity: "0" })),
      animate("200ms 200ms ease-in-out", style({ visibility: "hidden" })),
    ]),
  ]),
  transition("void => *", [
    group([
      animate("1ms ease-in-out", style({ visibility: "visible" })),
      animate("1ms ease-in-out", style({ transform: "translateX(-10px)" })),
      animate("100ms ease-in-out", style({ transform: "translateY(0%)" })),
      animate("100ms ease-in-out", style({ opacity: "1" })),
    ]),
  ]),
]);

// Default
export const SlideInFade = trigger("SlideInFade", [
  state("*", style({ opacity: 1, transform: "translateY(0%)" })),
  state("void", style({ opacity: 0, transform: "translateY(-100%)" })),
  transition("void => *", [
    style({ opacity: 0, transform: "translateY(-100%)" }),
    animate(
      ".2s ease-in-out",
      style({ opacity: 1, transform: "translateY(0%)" })
    ),
  ]),
  transition("* => void", [
    style({ opacity: 1, transform: "translateY(0%)" }),
    animate(
      ".2s ease-in-out",
      style({ opacity: 0, transform: "translateY(-100%)" })
    ),
  ]),
]);

export const LoaderAnimation = trigger("LoaderAnimation", [
  transition(":enter", [
    style({ opacity: 0 }),
    animate(".3s ease-out", style({ opacity: 1 })),
  ]),
]);

export const FadeIn = trigger("FadeIn", [
  state("*", style({ opacity: 1 })),
  state("void", style({ opacity: 0 })),
  transition("void => *", [
    style({ opacity: 0 }),
    animate(".3s ease-out", style({ opacity: 1 })),
  ]),
  transition("* => void", [
    style({ opacity: 1 }),
    animate(".3s ease-out", style({ opacity: 0 })),
  ]),
]);

export const CustomHightCollapse = trigger("CustomHightCollapse", [
  state(
    "*",
    style({ "max-height": "500px", opacity: "1", visibility: "visible" })
  ),
  state(
    "void",
    style({ "max-height": "0px", opacity: "0", visibility: "hidden" })
  ),
  transition("* => void", [
    group([
      animate("100ms ease-in-out", style({ opacity: "0" })),
      animate("250ms ease-in-out", style({ "max-height": "0px" })),
      animate("200ms ease-in-out", style({ visibility: "hidden" })),
    ]),
  ]),
  transition("void => *", [
    group([
      animate("1ms ease-in-out", style({ visibility: "visible" })),
      animate("300ms ease-in-out", style({ "max-height": "500px" })),
      animate("400ms ease-in-out", style({ opacity: "1" })),
    ]),
  ]),
]);

export const ViewTransition = trigger("ViewTransition", [
  transition(":enter", [
    style({
      opacity: 0.5,
      transform: "scale(.95) translate3d(0,0,0)",
    }),
    animate(
      ".3s ease",
      style({
        opacity: 1,
        transform: "*",
      })
    ),
  ]),
]);
