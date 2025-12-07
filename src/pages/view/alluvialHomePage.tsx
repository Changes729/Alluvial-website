import React, { Component, useEffect, useState, useRef, useMemo } from "react";

import style from "./homepage.module.scss";
import { DivPic } from "../widget/DivPic";
import {
  loadContent,
  MilkdownContent,
} from "../widget/AlluvialContent/content-loader";
import { DefaultAlluvialLoader } from "../widget/AlluvialContent/defaultContent";
import "react-complex-tree/lib/style-modern.css";
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItemIndex,
  TreeItem,
} from "react-complex-tree";
import { Router, useLocation, useNavigate } from "react-router";
import { Menu } from "../widget/AlluvialContent/menu";

interface AlluvialContent extends MilkdownContent {
  url: string;
}

export const AlluvialHomepage: React.FC<{}> = ({}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<MilkdownContent>({
    contentType: null,
    content: "",
  });
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

  function _index(tag: string) {
    return location.pathname + tag;
  }

  function hash(str: string) {
    let hash = 2166136261; // FNV-1a 算法的初始值
    for (let i = 0; i < str.length; i++) {
      // 逐个字符处理，并将结果限制在 32 位带符号整数
      hash ^= str.charCodeAt(i);
      hash *= 16777619;
      hash &= 0xffffffff; // 确保结果为 32 位整数
    }
    // 转换为无符号整数
    return hash >>> 0;
  }

  /** componentDidMount */
  useEffect(() => {
    if (!location.pathname.endsWith("/") || location.pathname.length == 0) {
      const indexOfSlash = location.pathname.indexOf("/");
      if (indexOfSlash == -1) {
        console.log("error redirect path: ", location.pathname);
      }
      const newUrl = location.pathname.substring(0, indexOfSlash + 1);
      console.log("navigate to ", newUrl);
      navigate(newUrl);
      return;
    }

    tagList.current = {
      root: {
        index: "root",
        isFolder: true,
        children: [],
        data: "Root item",
      },
    };
    setState({
      contentType: null,
      content: "",
    });
    setSelectedItems([]);

    loadContent(location.pathname)
      .then(({ contentType, content }) => {
        if (!contentType || !contentType.includes("text/directory")) {
          console.log("error");
        } else {
          let firstFile: string | null = null;

          (content as string[]).forEach((tagName) => {
            const isFolder = tagName.endsWith("/");

            tagList.current[hash(tagName)] = {
              data: decodeURI(tagName),
              index: hash(tagName),
              isFolder: isFolder,
            };
            tagList.current["root"].children?.push(hash(tagName));

            contentList.current[hash(tagName)] = {
              contentType: null,
              content: "",
              url: _index(tagName),
            };

            if (!isFolder && (tagName == "README.md" || firstFile == null)) {
              firstFile = tagName;
            }
          });

          if (firstFile !== null) {
            setSelectedItems([hash(firstFile)]);
            loadContent(location.pathname + firstFile).then(
              ({ contentType, content }) => {
                setState({ contentType, content });
              }
            );
          }
        }
      })
      .finally(() => {
        setTreeItems(tagList.current);
      });
  }, [location]);

  function onSelectItems(items: TreeItemIndex[], treeID: string) {
    setSelectedItems(items);

    const path = contentList.current[items[0]].url;
    const isFolder = path.endsWith("/");
    if (isFolder) {
      navigate(path);
    } else {
      loadContent(path).then(({ contentType, content }) => {
        setState({ contentType, content });
      });
    }
  }
  return (
    <div className={style["view-homepage"]}>
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
      <DefaultAlluvialLoader
        contentType={state.contentType}
        content={state.content}
      />
    </div>
  );
};

export default AlluvialHomepage;
