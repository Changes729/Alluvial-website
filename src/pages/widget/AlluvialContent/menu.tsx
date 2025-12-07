import React, { useRef } from "react";

import interact from "interactjs";
import style from "./menu.module.scss";

interface MenuProps {
  classStyle?: string;
}

export const Menu: React.FC<React.PropsWithChildren<MenuProps>> = ({
  children,
  classStyle,
}) => {
  const _this = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const targetElement = _this.current!;
    const offset = { x: 0, y: 0 };

    const targetInteratable = interact(targetElement);

    targetInteratable.resizable({
      edges: { top: false, left: false, bottom: false, right: true },
      invert: "reposition",
      listeners: {
        move: function (event) {
          const { width, height } = event.rect;

          offset.x += event.deltaRect.left;
          offset.y += event.deltaRect.top;

          Object.assign(targetElement.style, {
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          });
        },
      },
    });
  }, []);

  return (
    <div className={`${style["resize-drag"]} ${classStyle}`} ref={_this}>
      {children}
    </div>
  );
};
