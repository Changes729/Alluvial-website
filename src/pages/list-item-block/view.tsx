import type { Node } from "@milkdown/prose/model";
import type { NodeViewConstructor } from "@milkdown/prose/view";

import { listItemSchema } from "@milkdown/preset-commonmark";
import { TextSelection } from "@milkdown/prose/state";
import { $view } from "@milkdown/utils";
import ReactDOM from "react-dom/client";

import { withMeta } from "./meta";
import { ListItem } from "./component";
import { useEffect, useRef } from "react";

export const listItemBlockView = $view(
  listItemSchema.node,
  (ctx): NodeViewConstructor => {
    return (initialNode, view, getPos) => {
      const dom = document.createElement("div");
      dom.className = "milkdown-list-item-block";

      const contentDOM = document.createElement("div");
      contentDOM.setAttribute("data-content-dom", "true");
      contentDOM.classList.add("content-dom");

      console.log("initialNode attrs:", initialNode.attrs);
      var label = initialNode.attrs.label;
      var checked = initialNode.attrs.checked;
      var listType = initialNode.attrs.listType;
      var readonly = !view.editable;
      var selected = false;
      const setAttr = (attr: string, value: unknown) => {
        if (!view.editable) return;
        const pos = getPos();
        if (pos == null) return;

        if (!view.hasFocus()) view.focus();

        console.log("Dispatching setNodeAttribute:", attr, value);
        view.dispatch(view.state.tr.setNodeAttribute(pos, attr, value));
      };
      const disposeSelectedWatcher = (() => {
        const isSelected = selected;
        if (isSelected) {
          dom.classList.add("selected");
        } else {
          dom.classList.remove("selected");
        }
      });
      let raf = 0;
      const onMount = (div: HTMLElement) => {
        const { anchor, head } = view.state.selection;
        div.appendChild(contentDOM);
        // put the cursor to the new created list item
        const anchorPos = view.state.doc.resolve(anchor);
        const headPos = view.state.doc.resolve(head);
        raf = requestAnimationFrame(() => {
          cancelAnimationFrame(raf);
          if (!anchorPos.doc.eq(view.state.doc)) return;
          const selection = new TextSelection(anchorPos, headPos);
          view.dispatch(view.state.tr.setSelection(selection));
        });
      };

      const root = ReactDOM.createRoot(dom)
      root.render(
        <ListItem
          label={label}
          checked={checked}
          listType={listType}
          readonly={readonly}
          selected={selected}
          setAttr={setAttr}
          onMount={onMount}
        />
      );
      const bindAttrs = (node: Node) => {
        listType = node.attrs.listType;
        label = node.attrs.label;
        checked = node.attrs.checked;
        readonly = !view.editable;
      };

      bindAttrs(initialNode);
      let node = initialNode;
      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type !== initialNode.type) return false;

          if (
            updatedNode.sameMarkup(node) &&
            updatedNode.content.eq(node.content)
          )
            return true;

          node = updatedNode;
          bindAttrs(updatedNode);
          return true;
        },
        ignoreMutation: (mutation) => {
          if (!dom || !contentDOM) return true;

          if ((mutation.type as unknown) === "selection") return false;

          if (contentDOM === mutation.target && mutation.type === "attributes")
            return true;

          if (contentDOM.contains(mutation.target)) return false;

          return true;
        },
        selectNode: () => {
          selected = true;
        },
        deselectNode: () => {
          selected = false;
        },
        destroy: () => {
          disposeSelectedWatcher;
          root.unmount();
          dom.remove();
          contentDOM.remove();
        },
      };
    };
  }
);

withMeta(listItemBlockView, {
  displayName: "NodeView<list-item-block>",
  group: "ListItemBlock",
});
