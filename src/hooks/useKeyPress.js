import { useCallback, useEffect, useState } from "react";

const useKeyPress = (targetKeyCode) => {
  const [keyPress, setKeyPress] = useState(false);

  const keyDownHandle = useCallback(({keyCode}) => {
    if(keyCode === targetKeyCode) {
      setKeyPress(true)
    }
  }, [targetKeyCode])

  const keyUpHandle = useCallback(({keyCode}) => {
    if(keyCode === targetKeyCode) {
      setKeyPress(false)
    }
  }, [targetKeyCode])

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandle)
    document.addEventListener("keyup", keyUpHandle)
    return () => {
      document.removeEventListener("keyup", keyUpHandle)
      document.removeEventListener("keydown", keyDownHandle)
    }
  }, [keyDownHandle, keyUpHandle]);

  return keyPress;
}

export default useKeyPress;