import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math"
import { slide as Menu } from "react-burger-menu";
import "github-markdown-css"
import "../css/katex"
import "../css/markdown"
import "../css/burger_menu"


interface DocProps {
  doc: string;
}

class Doc extends Component<{}, DocProps> {
  constructor(props: {}) {
    super(props);
    this.state = { doc: "" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg: string) {
    var fetch_path = "/markdowns" + arg.substring("/doc".length);
    console.log(fetch_path)

    fetch(fetch_path, {
      method: "GET",
    }).then((res) => {
      res.text().then((markdown) => {
        this.setState({ doc: markdown });
      });
    });
  }

  componentDidMount() {
    this.loadView(window.location.pathname);
  }

  componentWillUpdate() {
  }

  render() {
    const url_path = window.location.pathname;
    const MARKDOWN = url_path.endsWith(".html") ? (
      <div
        dangerouslySetInnerHTML={{
          __html: this.state.doc,
        }}
      />
    ) : (
      <div id="readme" className="container">
        <ReactMarkdown
          children={this.state.doc}
          className="markdown-body"
          skipHtml={false}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        />
      </div>
    )

    return <div><Menu>
    </Menu> {MARKDOWN} </div>;
  }
}

export default Doc;
