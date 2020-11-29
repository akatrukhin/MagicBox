import {
  trigger,
  style,
  transition,
  animate,
  group,
  stagger,
  query,
  state,
} from "@angular/animations";

export const ImportAnimation = trigger("ImportAnimation", [
  transition(":enter", [
    group([
      style({
        opacity: 1,
      }),
      animate("350ms", style({ transform: "*", opacity: 1 })),
      query(".stagger", [
        style({
          opacity: 0,
          transform: "translateY(5vh)",
        }),
        stagger(125, [
          animate(
            "250ms 200ms ease-in-out",
            style({
              opacity: 1,
              transform: "translateY(0)",
            })
          ),
        ]),
      ]),
      query(".image-animation", [
        style({
          opacity: 0,
          transform: "translateY(30px) scale(1.3)",
        }),
        animate(
          "300ms 100ms ease-out",
          style({
            opacity: 1,
            transform: "*",
          })
        ),
      ]),
      query(".file-icon-animation", [
        style({
          opacity: 0,
          transform: "scale(.5) translateY(-10px)",
        }),
        animate(
          "100ms 400ms ease-in",
          style({
            opacity: 1,
            transform: "*",
          })
        ),
      ]),
    ]),
  ]),
]);

export const FooterAnimation = trigger("FooterAnimation", [
  transition(":enter", [
    style({
      opacity: 0,
      transform: "translateY(60px)",
    }),
    animate(
      ".3s .2s ease-out",
      style({
        opacity: 1,
        transform: "*",
      })
    ),
  ]),
  transition(":leave", [
    style({
      opacity: 1,
      transform: "*",
    }),
    animate(
      ".2s ease-out",
      style({
        opacity: 0,
        transform: "translateY(60px)",
      })
    ),
  ]),
]);

export const ViewTransition = trigger("ViewTransition", [
  transition(":enter", [
    style({
      position: "absolute",
      opacity: 0,
      transform: "scale(.95) translate3d(0,0,0)",
    }),
    animate(
      ".3s ease",
      style({
        position: "*",
        opacity: 1,
        transform: "*",
      })
    ),
  ]),
  transition(":leave", [
    style({
      position: "absolute",
      opacity: 1,
      transform: "*",
    }),
    animate(
      ".2s ease",
      style({
        position: "absolute",
        opacity: 0,
        transform: "scale(1.05) translate3d(0,0,0)",
      })
    ),
  ]),
]);

export const LoadingBar = trigger("LoadingBar", [
  state(
    "button",
    style({
      width: "*",
    })
  ),
  state(
    "loadingBar",
    style({
      width: "100%",
    })
  ),
  transition("button => loadingBar", [animate(".3s")]),
]);
