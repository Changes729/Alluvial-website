import React, { Component, useEffect, useState, useRef, useMemo } from "react";

import style from "./homepage.module.scss";
import { DivPic } from "../widget/DivPic";
import { Menu } from "../widget/AlluvialContent/menu";
import { BasicEditorView, getMarkdown, TidalEditor } from "alluvial-editor";
import {
  loadContent,
  saveContent,
  toFile,
} from "../widget/AlluvialContent/content-loader";
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItemIndex,
  TreeItem,
} from "react-complex-tree";
import { hash } from "../../utils/hash";

function fileName(base64file: string) {
  const file = decodeURI(base64file);
  const indexOfSlash = file.search(/[./]/);
  return indexOfSlash ? file.substring(0, indexOfSlash) : file;
}

const daysInChinese = ["日", "一", "二", "三", "四", "五", "六"];

export const AlluvialTidal: React.FC<{}> = ({}) => {
  var contentList = useRef<string[]>([]);
  const [editorState, setEditorState] = useState<TidalEditor[]>([]);
  const [treeItems, setTreeItems] = useState<Record<TreeItemIndex, TreeItem>>(
    {}
  );
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  const url = useRef<string>(`/日志/${new Date().getFullYear()}/`);

  let tagList = useRef<Record<TreeItemIndex, TreeItem>>({
    root: {
      index: "root",
      isFolder: true,
      children: [],
      data: "Root item",
    },
  });

  function saveFile() {
    contentList.current.forEach((f, i) => {
      saveContent(
        url.current + f + "/",
        toFile(
          "README.md",
          editorState[i].action(getMarkdown()),
          "text/markdown"
        )
      );
    });
  }

  useEffect(() => {
    setEditorState([]);
    tagList.current = {
      root: {
        index: "root",
        isFolder: true,
        children: [],
        data: "Root item",
      },
    };

    loadContent(url.current)
      .then(({ contentType, content }) => {
        if (!contentType || !contentType.includes("text/directory")) {
          console.log("error");
        } else {
          (content as string[]).forEach((tagName) => {
            if (tagName.endsWith("/")) {
              tagList.current[hash(tagName)] = {
                data: fileName(tagName),
                index: hash(tagName),
                isFolder: false,
              };
              tagList.current["root"].children?.push(hash(tagName));

              const editor = TidalEditor.make();
              setEditorState((state) => [editor, ...state]);
              contentList.current = [fileName(tagName), ...contentList.current];

              loadContent(url.current + tagName + "README.md").then(
                ({ contentType, content }) => {
                  if (!contentType || !contentType.includes("text/markdown")) {
                    console.log("error");
                  } else {
                    editor.UpdateEditorContent(content as string);
                  }
                }
              );
            }
          });
        }
      })
      .finally(() => {
        const date = new Date();
        const today = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
        if (!contentList.current.includes(today)) {
          console.log("add new");
          tagList.current[hash(today)] = {
            data: today,
            index: hash(today),
            isFolder: false,
          };
          tagList.current["root"].children?.push(hash(today));

          const editor = TidalEditor.make();
          setEditorState((state) => [editor, ...state]);
          contentList.current = [today, ...contentList.current];
        }

        setTreeItems(tagList.current);
      });
  }, []);

  function onSelectItems(items: TreeItemIndex[], treeID: string) {
    setSelectedItems(items);

    const elements = document.querySelectorAll(`h1.milkdown`);
    elements.forEach((e) => {
      if (e.innerHTML === tagList.current[items[0]].data) {
        e.scrollIntoView();
      }
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "o" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    } else if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveFile();
    }
  }

  return (
    <div className={style["view-homepage"]} onKeyDown={onKeyDown}>
      <Menu>
        <DivPic></DivPic>
        <ControlledTreeEnvironment
          items={treeItems}
          getItemTitle={(item) => item.data}
          viewState={{
            ["tree"]: {
              selectedItems,
            },
          }}
          canDragAndDrop={false}
          canDropOnFolder={false}
          canReorderItems={false}
          onSelectItems={onSelectItems}
        >
          <Tree treeId="tree" rootItem="root" treeLabel="Tree Example" />
        </ControlledTreeEnvironment>
      </Menu>
      <div className={style["abstract-content-part"]}>
        {editorState.map((editor, i) => (
          <>
            <h1 className="milkdown">
              {contentList.current[i] +
                `（${
                  daysInChinese[new Date(contentList.current[i]).getDay()]
                }）`}
            </h1>
            <BasicEditorView
              editor={editor}
              classStyle={style["editor-center"]}
            ></BasicEditorView>
          </>
        ))}
      </div>
    </div>
  );
};

export default AlluvialTidal;
