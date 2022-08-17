export interface MenuItemOptions {
  label: string;
  enabled: boolean;
}

export interface SetUpMenuOptions {
  menuItemOptions?: MenuItemOptions[] | null;
}
