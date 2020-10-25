import {
  trigger,
  style,
  transition,
  animate,
  query,
  stagger,
} from "@angular/animations";

export const DropDownItemsAnimation = trigger("DropDownItemsAnimation", [
  transition(":enter", [
    query(".stagger", [
      style({ opacity: 0, transform: "translate3d(30px,0,0)" }),
      stagger(33, [
        animate(
          ".15s .05s ease-out",
          style({ opacity: 1, transform: "translate3d(0,0,0)" })
        ),
      ]),
    ]),
  ]),
  transition("false => true", [
    query(".stagger", [
      style({ opacity: 0, transform: "translate3d(30px,0,0)" }),
      stagger(33, [
        animate(
          ".15s .05s ease-out",
          style({ opacity: 1, transform: "translate3d(0,0,0)" })
        ),
      ]),
    ]),
  ]),
]);
