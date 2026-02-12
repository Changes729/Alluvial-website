import React, { useMemo, useState, useRef, useEffect } from "react";
import { BasicEditorView, EmptyLinePrefix, TyporaEditor } from "alluvial-editor";
import style from "./content.module.scss";
import { MilkdownContent } from "./content-loader";

export const DefaultAlluvialLoader: React.FC<MilkdownContent> = ({
  contentType,
  content,
}) => {
  const [pageContent, setPageContent] = useState<string>("");
  const [styleClass, setStyleClass] = useState<string>("");
  const editor = useRef<TyporaEditor>(TyporaEditor.make());

  useMemo(() => {
    if (contentType?.includes("text/markdown")) {
      setPageContent(content as string);
      setStyleClass("");
    } else if (contentType?.includes("text/directory")) {
      const dirList = content as string[];
      const dirString = dirList.map((url) => `[${decodeURI(url)}](${url})`);
      setPageContent(dirString.join("\n\n"));
      setStyleClass(style.defaultDirPage);
    } else if (contentType?.includes("text/html")) {
      setPageContent(content as string);
    } else {
      setPageContent(content as string);
    }
  }, [contentType, content]);

  useEffect(() => {
    editor.current.UpdateEditorContent(EmptyLinePrefix(pageContent));
  }, [pageContent]);

  useEffect(() => {
    editor.current.create();
    editor.current.editable = () => false;
  }, []);

  return contentType?.includes("text/html") ? (
    <div dangerouslySetInnerHTML={{ __html: pageContent }} />
  ) : (
    <BasicEditorView
      editor={editor.current}
      classStyle={styleClass}
    ></BasicEditorView>
  );
};
