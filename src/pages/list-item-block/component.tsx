import React, { Component, Ref } from "react";

interface Attrs {
  label: string;
  checked: boolean;
  listType: string;
}

type ListItemProps = {
  label: string;
  checked: boolean | null;
  listType: string;
  readonly: boolean;
  selected: boolean;
  setAttr: <T extends keyof Attrs>(attr: T, value: Attrs[T]) => void;
  onMount: (div: HTMLElement) => void;

  children?: React.ReactNode;
};

export class ListItem extends Component<ListItemProps> {
  private _listItem: Ref<HTMLLIElement> = React.createRef();
  private _checkbox: Ref<HTMLInputElement> = React.createRef();

  constructor(props: ListItemProps) {
    super(props);

    this.onCheckboxClick = this.onCheckboxClick.bind(this);
  }

  onCheckboxClick(e: React.MouseEvent<HTMLInputElement>) {
    e.stopPropagation();
    // e.preventDefault();

    if (this.props.checked == null) return;
    this.props.setAttr("checked", this._checkbox.current!.checked);
  }

  componentDidMount() {
    this.props.onMount(this._listItem.current!);
  }

  render() {
    return (
      <li
        className={
          this.props.checked == null
            ? "list-item"
            : "task-list-item" +
              (this.props.selected ? " ProseMirror-selectednode" : "")
        }
        ref={this._listItem}
      >
        {this.props.checked !== null && (
          <input
            className="task-list-item-checkbox"
            type="checkbox"
            defaultChecked={this.props.checked ? true : false}
            contentEditable={true}
            onClick={this.onCheckboxClick}
            ref={this._checkbox}
          />
        )}
        {this.props.children}
      </li>
    );
  }
}
