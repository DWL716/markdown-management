import { useCallback, useEffect, useState, useRef } from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

import useKeyPress from '../hooks/useKeyPress'

function FileSearch({title, onFileSearch}) {
  const [inputActive, setInputActive] = useState(false)
  const [value, setValue] = useState('')
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  const onSetValue = useCallback((e) => {
    setValue(e.target.value)
  },[]);
  let nodeInput = useRef()
  // 关闭
  const closeSearch = () => {
    setInputActive(false);
    setValue('')
    onFileSearch('')
  }

  useEffect(() => {
    // 将键盘事件用hooks封装起来
    if (enterPressed && inputActive) {
      onFileSearch(value)
    }
    if (escPressed && inputActive) {
      closeSearch()
    }
    // const handleInputEvent = (event) => {
    //   const {keyCode} = event;
    //   if (keyCode === 13 && inputActive && value!== "") {
    //     onFileSearch(value)
    //   }else if (keyCode === 27 && inputActive) {
    //     closeSearch(event)
    //   }
    // }
    // document.addEventListener("keyup", handleInputEvent);
    // return () => {
    //   document.removeEventListener("keyup", handleInputEvent)
    // }
  })
  useEffect(() => {
    if (inputActive) {
      nodeInput.current.focus()
    }
  }, [inputActive])
  return (
    <div className="alert no-border alert-primary mb-0">
      {
        !inputActive && 
        <div className="d-flex justify-content-between align-items-center">
          <span>{title}</span>
          <button type="button" onClick={() => {setInputActive(true)}} className="icon-button">
            <FontAwesomeIcon title="搜索" size="lg" icon={faSearch}></FontAwesomeIcon>
          </button>
        </div>
      }
      {
        inputActive &&
        <div className="d-flex justify-content-between align-items-center">
          <input className="form-control" type="text" ref={nodeInput} value={value} onChange={onSetValue}/>
          <button type="button" onClick={closeSearch} className="icon-button">
            <FontAwesomeIcon title="关闭" size="lg" icon={faTimes}></FontAwesomeIcon>
          </button>
        </div>
      }
    </div>
  )
}

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}
export default FileSearch;