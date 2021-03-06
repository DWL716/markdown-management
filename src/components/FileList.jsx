import { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";

import useKeyPress from "../hooks/useKeyPress";
import useContextMenu from '../hooks/useContextMenu'
import { getParentNode } from '../utils/helper'

function FileList({ files, onFileClick, onSaveEdit, onFileDelete }) {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");
  let nodeInput = useRef();
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  // 关闭
  const closeSearch = useCallback((editItem) => {
    console.log(editItem);
    setEditStatus(false);
    setValue("");
    if (editItem.isNew) {
      onFileDelete(editItem.id)
    }
  }, [onFileDelete]);
  const clickedItem = useContextMenu([
    {
      label: '打开',
      click: () => {
        const parentElement = getParentNode(clickedItem.current, 'file-item')
        if (parentElement) {
          onFileClick(parentElement.dataset.id)
        }
      }
    },
    {
      label: '重命名',
      click: () => {
        const parentElement = getParentNode(clickedItem.current, 'file-item')
        if (parentElement) {
          const { id, title } = parentElement.dataset
          setEditStatus(id)
          setValue(title)
        }
      }
    },
    {
      label: '删除',
      click: () => {
        const parentElement = getParentNode(clickedItem.current, 'file-item')
        if (parentElement) {
          onFileDelete(parentElement.dataset.id)
        }
      }
    },
  ], '.file-list', [files])
  useEffect(() => {
    const editItem = files.find((file) => file.id === editStatus);
    if (enterPressed && editStatus && value.trim()) {
      onSaveEdit(editItem.id, value, editItem.isNew);
      setEditStatus(false);
      setValue("");
    }
    if (escPressed && editStatus) {
      // onSaveEdit(editItem.id, value);
      // closeSearch(editItem)
      closeSearch(editItem)
    }
  }, [closeSearch, editStatus, enterPressed, escPressed, files, onSaveEdit, value]);

  useEffect(() => {
    if (editStatus) {
      nodeInput.current.focus();
    }
  });
  // 当有创建新当file时候
  useEffect(() => {
    const newFile = files.find((file) => file.isNew);
    console.log(newFile);
    // 将editStatus 的id设置成当前新建文件的id
    if (newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);
  return (
    <ul className="list-group list-group-flush file-list ">
      {files.map((file) => (
        <li
        className="list-group-item bg-light row d-flex align-items-center file-item mx-0"
        key={file.id}
        data-id={file.id}
        data-title={file.title}
      >
        { (file.id !== editStatus && !file.isNew) &&
        <>
          <span className="col-2">
            <FontAwesomeIcon
              size="lg"
              icon={faMarkdown} 
            />
          </span>
          <span 
            className="col-10 c-link"
            onClick={() => {onFileClick(file.id)}}
          >
            {file.title}
          </span>
        </>
        }
          {(file.id === editStatus || files.isNew) && (
            <>
              <div className="d-flex justify-content-between align-items-center">
                <input
                  className="form-control"
                  type="text"
                  placeholder="请输入文件名称"
                  ref={nodeInput}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {closeSearch(file)}}
                  className="icon-button"
                >
                  <FontAwesomeIcon
                    title="关闭"
                    size="lg"
                    icon={faTimes}
                  ></FontAwesomeIcon>
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onSaveEdit: PropTypes.func,
  onFileDelete: PropTypes.func,
};
export default FileList;


/* 

<>
              <span className="col-2 font-markdown-padding">
                <FontAwesomeIcon size="lg" icon={faMarkdown} />
              </span>
              <span
                onClick={() => {
                  onFileClick(file.id);
                }}
                className="col-7 left-file-title"
              >
                {file.title}
              </span>
              <button
                onClick={() => {
                  setEditStatus(file.id);
                  setValue(file.title);
                }}
                className="col-1 font-icon-pad-left icon-button"
              >
                <FontAwesomeIcon title="编辑" size="lg" icon={faEdit} />
              </button>
              <button
                onClick={() => {
                  onFileDelete(file.id);
                }}
                className="col-1 font-icon-pad-right icon-button"
              >
                <FontAwesomeIcon title="删除" size="lg" icon={faTrash} />
              </button>
            </>
*/
