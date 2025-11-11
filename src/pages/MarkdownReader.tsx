import React, { Component } from "react";
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

interface DocProps {
  doc: string;
  excalidrawAPI?: ExcalidrawImperativeAPI;
}
class Doc extends Component<{}, DocProps> {
  constructor(props: {}) {
    super(props);
    this.state = { doc: "[]" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg: string) {
    var fetch_path = "/markdowns" + arg.substring("/doc".length);
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
          this.setState({ doc: markdown });
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
        <div className="markdown-body">
          <ReactMarkdown
            children={this.state.doc}
            skipHtml={false}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
          />
        </div>
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

export default Doc;
