import React, { Component, useEffect, useState, useRef, useMemo } from "react";

import style from "./homepage.module.scss";
import { DivPic } from "../widget/DivPic";
import { Menu } from "../widget/AlluvialContent/menu";
import { BasicEditorView, TidalEditor, TyporaEditor } from "alluvial-editor";

export const AlluvialTidal: React.FC<{}> = ({}) => {
  const editor = useRef<TyporaEditor>(TyporaEditor.make());

  useEffect(() => {
    editor.current.create();
  });

  return (
    <div className={style["view-homepage"]}>
      <Menu>
        <DivPic></DivPic>
      </Menu>
      <div className={style["abstract-content-part"]}>
        <BasicEditorView
          editor={editor.current}
          classStyle={style["editor-center"]}
        ></BasicEditorView>
      </div>
    </div>
  );
};

export default AlluvialTidal;
