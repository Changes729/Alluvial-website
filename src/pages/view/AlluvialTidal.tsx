import React, {
  Component,
  useEffect,
  useState,
  useRef,
  useMemo,
  useTransition,
} from "react";

import style from "./homepage.module.scss";
import { DivPic } from "../widget/DivPic";
import { Menu } from "../widget/AlluvialContent/menu";
import { BasicEditorView, getMarkdown, TidalEditor } from "alluvial-editor";
import type { TidalData } from "alluvial-editor";
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
import { waitUntil } from "alluvial-editor/web/utils/utils";

function fileName(base64file: string) {
  const file = decodeURI(base64file);
  const indexOfSlash = file.search(/[./]/);
  return indexOfSlash ? file.substring(0, indexOfSlash) : file;
}

export const AlluvialTidal: React.FC<{}> = ({}) => {
  var contentList = useRef<string[]>([]);
  const [dataRecord, setDataRecord] = useState<Record<string, string>>({});
  const editor = useRef<TidalEditor>(TidalEditor.make());
  const [treeItems, setTreeItems] = useState<Record<TreeItemIndex, TreeItem>>(
    {}
  );
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  const [isPending, startTransition] = useTransition();
  const url = useRef<string>(`/tidal/`);

  let tagList = useRef<Record<TreeItemIndex, TreeItem>>({
    root: {
      index: "root",
      isFolder: true,
      children: [],
      data: "Root item",
    },
  });

  function saveFile() {
    const data = editor.current.tidalData();
    data.forEach((v) => {
      var named = "vision";
      if (Object.hasOwn(v, "date")) {
        const formatter = new Intl.DateTimeFormat("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        named = formatter.format(v.date);
      }

      saveContent(
        "/tidal/" + named,
        toFile("README.md", v.str, "text/markdown")
      );
    });
  }

  function newDate(dateStr: string) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, 12);
  }

  useEffect(() => {
    if (!isPending) {
      let val: TidalData[] = [];
      contentList.current.forEach((value) => {
        if (dataRecord[value] != undefined)
          val.push(
            value == "vision"
              ? { str: dataRecord[value] }
              : { date: newDate(value), str: dataRecord[value] }
          );
      });

      if (val.length) editor.current.initTidal(val);
    }
  }, [isPending]);

  useEffect(() => {
    if (!isPending) {
      startTransition(async () => {
        await waitUntil(() => editor.current.CouldUpdate());
      });
    }
  }, [dataRecord]);

  useEffect(() => {
    tagList.current = {
      root: {
        index: "root",
        isFolder: true,
        children: [],
        data: "Root item",
      },
    };

    loadContent("/tidal/")
      .then(({ contentType, content }) => {
        if (!contentType || !contentType.includes("text/directory")) {
          console.log("error");
        } else {
          for (const item of content) {
            for (const [key, value] of Object.entries(item)) {
              tagList.current[hash(key)] = {
                data: key,
                index: hash(key),
                isFolder: false,
              };
              tagList.current["root"].children = [
                hash(key),
                ...tagList.current["root"].children!,
              ];

              contentList.current = [key, ...contentList.current];

              loadContent("/tidal/" + key).then(({ contentType, content }) => {
                if (!contentType || !contentType.includes("text/markdown")) {
                  console.log("error:", contentType, content);
                } else {
                  setDataRecord((prev) => ({
                    ...prev,
                    [key]: content as string,
                  }));
                }
              });
            }
          }
        }
      })
      .finally(() => {
        const date = new Date();
        const today = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
        if (!contentList.current.includes(today)) {
          tagList.current[hash(today)] = {
            data: today,
            index: hash(today),
            isFolder: false,
          };
          tagList.current["root"].children = [
            hash(today),
            ...tagList.current["root"].children!,
          ];

          contentList.current = [today, ...contentList.current];
          setDataRecord((prev) => ({
            ...prev,
            [today]: "",
          }));
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
      <BasicEditorView editor={editor.current}></BasicEditorView>
    </div>
  );
};

export default AlluvialTidal;
