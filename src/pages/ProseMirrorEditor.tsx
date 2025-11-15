import React, { Children, Component } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import "github-markdown-css";
import "../css/katex";
import "../css/markdown";
import "../css/burger_menu";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/dist/types/excalidraw/types";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";

import { EditorView, NodeView } from "prosemirror-view";
import { EditorState, Plugin } from "prosemirror-state";
import { unified } from "unified";
import {
  remarkProseMirror,
  toPmNode,
  toPmMark,
  fromProseMirror,
  fromPmNode,
  fromPmMark,
  type RemarkProseMirrorOptions,
} from "@handlewithcare/remark-prosemirror";
import { type Node as PmNode, NodeType, Attrs } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { baseKeymap } from "./commands";
import { keymap } from "prosemirror-keymap";
import "../css/editor.scss";

import { mySchema } from "./mySchema";
import { Transform } from "prosemirror-transform";

interface DocProps {
  doc: string;
  excalidrawAPI?: ExcalidrawImperativeAPI;
}
class PMEditorView extends Component<{}, DocProps> {
  private _placeHolder = React.createRef<HTMLDivElement>();
  private _view?: EditorView;

  constructor(props: {}) {
    super(props);
    this.state = { doc: "[]" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg: string) {
    var fetch_path = "/markdowns" + arg.substring("/editor".length);
    console.log(fetch_path);

    fetch(fetch_path, {
      method: "GET",
    }).then((res) => {
      res.text().then((markdown) => {
        if (this.state.excalidrawAPI) {
          this.state.excalidrawAPI.updateScene({
            elements: JSON.parse(markdown).elements,
          });
        } else {
          this._view = new EditorView(this._placeHolder.current!, {
            state: EditorState.create({
              doc: markdownToProseMirror(markdown),
              schema: mySchema,
              plugins: [
                history(),
                keymap({
                  "Mod-z": undo,
                  "Mod-y": redo,
                  "Ctrl-s": (s) => {
                    console.log(proseMirrorToMarkdown(s.doc));
                    return true;
                  },
                }),
                keymap(baseKeymap),
              ],
            }),
            nodeViews: {
              list_item(node, view, getPos) {
                return new ListItem(node, view, getPos);
              },
            },
          });

          this._view.focus();
        }
      });
    });
  }

  componentDidMount() {
    this.loadView(window.location.pathname);
  }

  componentWillUpdate() {}

  render() {
    const url_path = window.location.pathname;
    var AlluvialDocument = (
      <div id="readme" className="container">
        <div className="markdown-body" ref={this._placeHolder} />
      </div>
    );

    if (url_path.endsWith(".html")) {
      console.log("html file");
      AlluvialDocument = (
        <div
          dangerouslySetInnerHTML={{
            __html: this.state.doc,
          }}
        />
      );
    } else if (url_path.endsWith(".excalidraw")) {
      console.log("excalidraw file");
      AlluvialDocument = (
        <>
          <div style={{ height: "100%" }}>
            <Excalidraw
              excalidrawAPI={(api) => {
                this.setState({ excalidrawAPI: api });
              }}
            />
          </div>
        </>
      );
    }

    return <div> {AlluvialDocument} </div>;
  }
}

function markdownToProseMirror(markdown: string): PmNode {
  const doc = unified()
    // Use remarkParse to parse the markdown string
    .use(remarkParse)
    .use(remarkGfm)
    // Convert to ProseMirror with the remarkProseMirror plugin.
    // It takes the schema and a set of handlers, each of which
    // maps an mdast node type to a ProseMirror node (or nodes)
    .use(remarkProseMirror, {
      schema: mySchema,
      handlers: {
        // For simple nodes, you can use the built-in toPmNode
        // util
        paragraph: toPmNode(mySchema.nodes.paragraph),
        listItem(node, _, state) {
          var children = state.all(node);
          return mySchema.nodes.list_item.createAndFill(
            { checked: node.checked },
            children
          );
        },
        // If you need to take over control, you can write your
        // own handler, which gets passed the mdast node, its
        // parent, and the plugin state, which has helper methods
        // for converting nodes from mdast to ProseMirror.
        list(node, _, state) {
          console.log(node);
          const children = state.all(node);
          const nodeType = node.ordered
            ? mySchema.nodes.ordered_list
            : mySchema.nodes.bullet_list;
          return nodeType.createAndFill({}, children);
        },
        heading(node, _, state) {
          const children = state.all(node);
          return mySchema.nodes.heading.create({ level: node.depth }, children);
        },
        thematicBreak() {
          return mySchema.nodes.horizontal_rule.createAndFill();
        },
        blockquote(node, _, state) {
          const children = state.all(node);
          return mySchema.nodes.blockquote.createAndFill({}, children);
        },
        inlineCode(node) {
          return mySchema.nodes.code_block.create(
            { params: "" },
            mySchema.text(node.value)
          );
        },
        code(node) {
          return mySchema.nodes.code_block.create(
            { params: node.lang || "" },
            mySchema.text(node.value)
          );
        },
        delete(node) {
          return mySchema.nodes.hard_break.create();
        },

        // You can also treat mdast nodes as ProseMirror marks
        emphasis: toPmMark(mySchema.marks.em),
        strong: toPmMark(mySchema.marks.strong),
        // And you can set attrs on nodes or marks based on
        // the mdast data
        link: toPmMark(mySchema.marks.link, (node) => ({
          href: node.url,
          title: node.title,
        })),
      },
    } satisfies RemarkProseMirrorOptions)
    .processSync(markdown);

  return doc.result;
}

function proseMirrorToMarkdown(doc: PmNode) {
  // Convert to mdast with the fromProseMirror util.
  // It takes a schema, a set of node handlers, and a
  // set of mark handlers, each of which converts a
  // ProseMirror node or mark to an mdast node.
  const mdast = fromProseMirror(doc, {
    schema: mySchema,
    nodeHandlers: {
      // Simple nodes can be converted with the fromPmNode
      // util.
      paragraph: fromPmNode("paragraph"),
      list_item: fromPmNode("listItem", (node) => ({
        checked: node.attrs.checked,
      })),
      // You can set mdast node properties from the
      // ProseMirror node or its attrs
      heading: fromPmNode("heading", (node) => ({
        depth: node.attrs.level,
      })),
      ordered_list: fromPmNode("list", () => ({
        ordered: true,
      })),
      bullet_list: fromPmNode("list", () => ({
        ordered: false,
      })),
      code_block: fromPmNode("code", (node) => ({
        value: new Transform(node).doc.textContent.toString(),
        lang: node.attrs.params,
      })),
    },
    markHandlers: {
      // Simple marks can be converted with the fromPmMark
      // util.
      em: fromPmMark("emphasis"),
      strong: fromPmMark("strong"),
      // Again, mdast node properties can be set from the
      // ProseMirror mark attrs
      link: fromPmMark("link", (mark) => ({
        url: mark.attrs["href"],
        title: mark.attrs["title"],
      })),
    },
  });

  console.log(mdast);

  return unified().use(remarkGfm).use(remarkStringify).stringify(mdast);
}

class ListItem implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  view: EditorView;

  constructor(
    node: PmNode,
    view: EditorView,
    getPos: () => number | undefined
  ) {
    var dom = document.createElement("li") as HTMLLIElement;

    if (node.attrs.checked != null) {
      var checkbox = document.createElement("input") as HTMLInputElement;
      checkbox.className = "task-list-item-checkbox";
      checkbox.type = "checkbox";
      checkbox.contentEditable = "true";
      checkbox.checked = node.attrs.checked;

      checkbox.addEventListener("click", () => {
        console.log("check box onchange");
        var pos = this.view.posAtDOM(this.dom, 0);
        let newState = this.view.state.apply(this.view.state.tr);

        var found;
        console.log(pos);
        newState.doc.descendants((node, n_pos) => {
          console.log(node, n_pos);
          if (n_pos < pos) {
            found = { node, pos };
          } else {
            found.node.attrs.checked = !found.node.attrs.checked;
            return false;
          }
        });
        this.view.updateState(newState);
      });

      dom.className = "task-list-item";
      dom.appendChild(checkbox);
    }

    this.contentDOM = document.createElement("span");
    dom.appendChild(this.contentDOM);
    this.dom = dom;
    this.view = view;
  }
}

export default PMEditorView;
