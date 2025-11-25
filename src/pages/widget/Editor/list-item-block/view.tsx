import type { Node as PmNode } from "@milkdown/prose/model";
import type { NodeViewConstructor } from "@milkdown/prose/view";

import { listItemSchema } from "@milkdown/preset-commonmark";
import { $view } from "@milkdown/utils";

import { withMeta } from "./meta";

export const listItemBlockView = $view(
  listItemSchema.node,
  (ctx): NodeViewConstructor => {
    return (initialNode, view, getPos) => {
      const updateAttrs = (node: PmNode) => {
        const isTaskList = node.attrs.checked !== null;
        if (isTaskList && checkbox == null) {
          dom.removeChild(contentDOM);

          checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");
          checkbox.defaultChecked = initialNode.attrs.checked ? true : false;
          checkbox.onclick = (e) => {
            e.stopPropagation();
            setAttr("checked", checkbox!.checked);
          };

          dom.appendChild(checkbox);
          dom.appendChild(contentDOM);
        }
      };

      const dom = document.createElement("li");
      dom.className = "list-item";
      let checkbox: HTMLInputElement | null = null;

      const contentDOM = document.createElement("div");
      contentDOM.setAttribute("data-content-dom", "true");
      contentDOM.classList.add("content-dom");
      dom.appendChild(contentDOM);
      updateAttrs(initialNode);

      let selected = false;
      const setAttr = (attr: string, value: unknown) => {
        if (!view.editable) return;
        const pos = getPos();
        if (pos == null) return;

        if (!view.hasFocus()) view.focus();

        console.log("Dispatching setNodeAttribute:", attr, value);
        view.dispatch(view.state.tr.setNodeAttribute(pos, attr, value));
      };

      const disposeSelectedWatcher = () => {
        if (selected) {
          dom.classList.add("selected");
        } else {
          dom.classList.remove("selected");
        }
      };

      let node = initialNode;
      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type !== initialNode.type) return false;

          if (
            updatedNode.sameMarkup(node) &&
            updatedNode.content.eq(node.content)
          ) {
            return true;
          }

          node = updatedNode;
          updateAttrs(updatedNode);
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
          // root.unmount();
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
