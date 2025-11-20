import React, { Component } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/dist/types/excalidraw/types";

import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";
import { gfm } from "@milkdown/kit/preset/gfm";
import "../css/editor.scss";

interface DocProps {
  doc: string;
  excalidrawAPI?: ExcalidrawImperativeAPI;
}

import { listItemBlockComponent } from "./list-item-block";

class MilkDownEditor extends Component<{}, DocProps> {
  private _editor?: Editor;

  constructor(props: {}) {
    super(props);
    this.state = { doc: "[]" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg: string) {
    var fetch_path = "/markdowns" + arg.substring("/milkdown".length);
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
          this._editor = Editor.make()
            .config((ctx) => {
              // ctx.set(rootCtx, ".markdown-body");
              ctx.set(rootCtx, "#readme");
              ctx.set(defaultValueCtx, markdown);
            })
            .config(nord)
            .use(commonmark)
            .use(gfm)
            .use(history)
            // .use(listItemBlockComponent);
          this._editor.create();
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
      <div id="readme" className="container markdown-body">
        {/* <div className="markdown-body" >
        </div> */}
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

export default MilkDownEditor;
