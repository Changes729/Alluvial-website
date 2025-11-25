import React, { Component } from "react";

import {
  defaultValueCtx,
  Editor,
  editorViewOptionsCtx,
  rootCtx,
} from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import { getMarkdown } from "@milkdown/utils";
import { gfm } from "@milkdown/kit/preset/gfm";

import "./milkdown.scss";

import { listItemBlockComponent } from "./list-item-block";

interface DocState {
  editable: boolean;
}

class MilkDownEditor extends Component<
  { editable?: boolean; defContent?: string },
  DocState
> {
  private _editor: Editor;

  constructor(props: { editable?: boolean }) {
    super(props);
    this.state = {
      editable: this.props.editable != undefined ? this.props.editable : true,
    };

    this._editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, "#readme");
        ctx.set(editorViewOptionsCtx, {
          editable: () => this.state.editable,
        });
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listItemBlockComponent);

    this.UpdateEditorContent = this.UpdateEditorContent.bind(this);
    this.Content = this.Content.bind(this);
  }

  UpdateEditorContent(newContent: string | null) {
    if (newContent) {
      this._editor.config((ctx) => {
        ctx.set(defaultValueCtx, newContent);
      });
      this._editor.create();
    }
  }

  Content() {
    return this._editor.action(getMarkdown());
  }

  _fileAutoSave() {
    localStorage.setItem("docContent", this.Content());
  }

  componentDidMount() {
    const defContent = this.props.defContent
      ? this.props.defContent
      : localStorage.getItem("docContent");

    this.UpdateEditorContent(defContent);
    /** NOTE: create is an async function. if set content after create. will failed. */
    this._editor.create();
    setInterval(() => this._fileAutoSave(), 1000);
  }

  render() {
    return <div id="readme" className={"container markdown-body"}></div>;
  }
}

export default MilkDownEditor;
