import React, { useMemo, useState, useRef, useEffect } from "react";
import MilkDownEditor from "alluvial-editor";
import style from "./content.module.scss";
import { MilkdownContent } from "./content-loader";

export const DefaultAlluvialLoader: React.FC<MilkdownContent> = ({
  contentType,
  content,
}) => {
  const [pageContent, setPageContent] = useState<string>("");
  const [styleClass, setStyleClass] = useState<string>("");
  const editor = useRef<MilkDownEditor>(null);

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
    editor.current?.UpdateEditorContent(pageContent);
  }, [pageContent]);

  return contentType?.includes("text/html") ? (
    <div dangerouslySetInnerHTML={{ __html: pageContent }} />
  ) : (
    <MilkDownEditor className={styleClass} ref={editor} editable={false} />
  );
};
