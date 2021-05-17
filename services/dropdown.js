export default class DropdownHolder {
  static dropDown;

  static setDropdown(dropDown) {
      this.dropDown = dropDown;
  }

  static getDropdown() {
      return this.dropDown;
  }
}