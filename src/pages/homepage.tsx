import React, { Component } from "react";

import MilkDownEditor from "./widget/Editor/milkdown";

import style from "./homepage.module.scss";
import { DivPic } from "./widget/DivPic";

class Homepage extends Component<{}, {}> {
  private _editor = React.createRef<MilkDownEditor>();
  private _htmlViewer = React.createRef<HTMLDivElement>();

  constructor(props: {}) {
    super(props);
  }

  loadView(arg: string) {
    var fetch_path = "/markdowns" + arg;
    console.log(fetch_path);

    fetch(fetch_path, {
      method: "GET",
    }).then((res) => {
      res.text().then((markdown) => {
        this._editor.current?.UpdateEditorContent(markdown);
        this._htmlViewer.current?.setHTMLUnsafe(markdown);
      });
    });
  }

  componentDidMount() {
    this.loadView(window.location.pathname);
  }

  render() {
    const url_path = window.location.pathname;
    var contentViewer = (
      <div className={style["html-list"]} ref={this._htmlViewer}></div>
    );
    if (url_path.endsWith(".md")) {
      contentViewer = (
        <MilkDownEditor ref={this._editor} editable={false}></MilkDownEditor>
      );
    }
    return (
      <div className={style["view-homepage"]}>
        <div>
          <DivPic></DivPic>
        </div>
        {contentViewer}
      </div>
    );
  }
}

export default Homepage;
