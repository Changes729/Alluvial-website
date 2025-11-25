import React, { FunctionComponent as FC } from "react";

import styles from "./index.module.scss";

interface divPicProps {
  style?: string;
}

export const DivPic: FC<divPicProps> = ({ style }) => (
  <div className={styles.diagonal}></div>
);
