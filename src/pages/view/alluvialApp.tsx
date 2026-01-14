import React, { useEffect, useState, useRef } from "react";

import style from "./homepage.module.scss";
import { MilkdownContent } from "../widget/AlluvialContent/content-loader";
import "react-complex-tree/lib/style-modern.css";
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItemIndex,
  TreeItem,
} from "react-complex-tree";
import { Menu } from "../widget/AlluvialContent/menu";
import { hash } from "../../utils/hash";
import { BasicEditorView, getMarkdown, TyporaEditor } from "alluvial-editor";

interface AlluvialContent extends MilkdownContent {
  url: string;
}

export const AlluvialApp: React.FC<{}> = ({}) => {
  const [treeItems, setTreeItems] = useState<Record<TreeItemIndex, TreeItem>>(
    {}
  );
  var contentList = useRef<Record<TreeItemIndex, AlluvialContent>>({});
  let tagList = useRef<Record<TreeItemIndex, TreeItem>>({
    root: {
      index: "root",
      isFolder: true,
      children: [],
      data: "Root item",
    },
  });
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const editor = useRef<TyporaEditor>(TyporaEditor.make());
  const handler = useRef<TreeItemIndex>(null);

  async function _load_content() {
    tagList.current = {
      root: {
        index: "root",
        isFolder: true,
        children: [],
        data: "Root item",
      },
    };

    const queue: string[] = [""];

    while (queue.length != 0) {
      const path: string = queue.shift()!;
      const pIndex = path.length ? hash(path) : "root";
      const content: string[] = await window.fsList(path);

      content.forEach((tagName) => {
        const isFolder = tagName.endsWith("/");

        const full_path = path + tagName;
        const index = hash(full_path);
        tagList.current[index] = {
          data: tagName,
          index: index,
          isFolder: isFolder,
          children: isFolder ? [] : undefined,
        };
        tagList.current[pIndex].children!.push(index);

        contentList.current[index] = {
          contentType: null,
          content: "",
          url: full_path,
        };

        if (isFolder) {
          queue.push(full_path);
        }
      });
    }

    setTreeItems(tagList.current);
  }

  /** componentDidMount */
  useEffect(() => {
    setSelectedItems([]);

    window.onkeydown = async (ev) => {
      if (ev.key == "o" && ev.ctrlKey) {
        if (await window.fsChangeDir()) {
          _load_content();
        }
      } else if (ev.key == "s" && ev.ctrlKey) {
        saveFile();
      }

      editor.current.editable = () => !ev.ctrlKey;
    };

    window.onkeyup = (ev) => {
      /** ev.ctrlKey will be set when key control up */
      editor.current.editable = () => !ev.ctrlKey || ev.key == "Control";
    };

    _load_content();
  }, []);

  function onSelectItems(items: TreeItemIndex[], treeID: string) {
    setSelectedItems(items);

    const path = contentList.current[items[0]].url;
    const isFolder = path.endsWith("/");
    if (isFolder) {
    } else {
      handler.current = items[0];
      window.fsRead(path).then((content) => {
        editor.current.UpdateEditorContent(content);
      });
    }
  }

  function saveFile() {
    console.log(handler.current);
    let url = handler.current
      ? contentList.current[handler.current].url
      : "utility.md";

    function bytesToBase64(bytes: Uint8Array<ArrayBuffer>) {
      const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte)
      ).join("");
      return btoa(binString);
    }

    const str = editor.current.action(getMarkdown());
    window.fsWrite(url, bytesToBase64(new TextEncoder().encode(str)));

    // const blob = new Blob([str], { type: "text/markdown" });
    // saveContentBlob(url, blob);
  }

  return (
    <div className={style["view-homepage"]}>
      <Menu>
        <ControlledTreeEnvironment
          items={treeItems}
          getItemTitle={(item) => item.data}
          viewState={{
            ["tree"]: {
              selectedItems,
              expandedItems,
            },
          }}
          canDragAndDrop={false}
          canDropOnFolder={false}
          canReorderItems={false}
          onSelectItems={onSelectItems}
          onExpandItem={(item) =>
            setExpandedItems([...expandedItems, item.index])
          }
          onCollapseItem={(item) =>
            setExpandedItems(
              expandedItems.filter(
                (expandedItemIndex) => expandedItemIndex !== item.index
              )
            )
          }
        >
          <Tree treeId="tree" rootItem="root" treeLabel="Tree Example" />
        </ControlledTreeEnvironment>
      </Menu>
      <BasicEditorView
        editor={editor.current}
        classStyle={style["editor-center"]}
      ></BasicEditorView>
    </div>
  );
};

export default AlluvialApp;
