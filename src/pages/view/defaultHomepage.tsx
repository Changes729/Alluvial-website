import React, { Component, useEffect, useState } from "react";

import style from "./homepage.module.scss";
import { DivPic } from "../widget/DivPic";
import {
  loadContent,
  MilkdownContent,
} from "../widget/AlluvialContent/content-loader";

export interface HomepageTemplate {
  View: React.FC<MilkdownContent>;
}

export const DefaultHomepage: React.FC<HomepageTemplate> = ({ View }) => {
  const url_path = window.location.pathname;
  const [state, setState] = useState<MilkdownContent>({
    contentType: null,
    content: "",
  });

  /** componentDidMount */
  useEffect(() => {
    loadContent(url_path).then(({ contentType, content }) => {
      setState({ contentType, content });
    });
  }, []);

  return (
    <div className={style["view-homepage"]}>
      <div>
        <DivPic></DivPic>
      </div>
      <View contentType={state.contentType} content={state.content} />
    </div>
  );
};

export default DefaultHomepage;
