export class NavLinkModel {
  constructor(
    label: string,
    value: string,
    iconClassName: string,
  ) {
    this.label = label;
    this.value = value;
    this.iconClassName = iconClassName;
  }

  label: string;
  value: string;
  iconClassName: string;
}
