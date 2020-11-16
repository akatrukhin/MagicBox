import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  sequence,
} from "@angular/animations";

export const StaggerAnimation = trigger("StaggerAnimation", [
  transition(":enter", [
    query(
      ".file-grid",
      [
        style({ opacity: 0, filter: "grayscale(100%)" }),
        stagger(
          75,
          sequence([
            animate("200ms ease-in-out", style({ opacity: 1 })),
            animate(
              "150ms 50ms ease-in-out",
              style({
                filter: "*",
              })
            ),
          ])
        ),
      ],
      { optional: true }
    ),
  ]),
]);

export const NewFileAnimation = () =>
  trigger("NewFileAnimation", [
    state("new", style({ opacity: 1, transform: "translateY(0%)" })),
    state(
      "void",
      style({ opacity: 0, transform: "translateY(10%) scale(.8)" })
    ),
    transition("void => new", [animate("150ms ease-in-out")]),
  ]);
