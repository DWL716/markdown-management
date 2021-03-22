import { useEffect, useRef } from "react"
const { remote }  = window.require("electron");
const {Menu, MenuItem} = remote

const useContextMenu = (itemArr, targetSelector, deps) => {
  let clickedElement = useRef(null)
  useEffect(() => {
    const menu = new Menu()
    itemArr.forEach(item => {
      menu.append(new MenuItem(item))
    });
    const handContextMenu = (e) => {
      // 指定某个区域可以显示出菜单
      if (document.querySelector(targetSelector).contains(e.target)) {
        clickedElement.current = e.target
        menu.popup({window: remote.getCurrentWindow() })
      }
    }
    window.addEventListener("contextmenu", handContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handContextMenu)
    }
  }, deps)
  return clickedElement
}

export default useContextMenu;