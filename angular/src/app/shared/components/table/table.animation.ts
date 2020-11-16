import {
  trigger,
  style,
  transition,
  animate,
  state,
} from "@angular/animations";

export const NewFileAnimation = trigger("NewFileAnimation", [
  state("new", style({ opacity: 1, transform: "*" })),
  state("void", style({ opacity: 0, transform: "scale(1.05)" })),
  transition("void => new", [animate("150ms ease-in-out")]),
  transition(":leave", [
    style({
      opacity: 1,
      transform: "*",
    }),
    animate(
      "100ms ease-in",
      style({
        opacity: 0,
        transform: "scale(.95)",
      })
    ),
  ]),
]);
