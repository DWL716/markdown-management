import { useCallback, useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor'
import {v4 as uuidv4} from 'uuid'

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TableList from './components/TableList'
import { faPlus, faFileImport, faSave } from "@fortawesome/free-solid-svg-icons"; 

// import defaultFiles from './utils/defaultFiles'
import fileHelper  from './utils/fileHelper'
import {objToArr, flattenArr} from './utils/helper'

import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css";
import './App.css';

const { join, basename, extname, dirname } = window.require('path')
const {remote, ipcRenderer} = window.require("electron");
const Store = window.require("electron-store")
const fileStore = new Store({"name": "files Data"})

const saveFilesToStore = (files) => {
  const filesObjectStore = objToArr(files).reduce((result, file) => {
    const {id, path, title, createAt} = file;
    result[id] = {
      id,
      path,
      title,
      createAt
    }
    return result
  }, {})
  fileStore.set("files", filesObjectStore)
}

function App() {
  // markdown的所有数据
  const [files, setFiles] = useState(fileStore.get('files') || {})
  // 用来搜索的数组
  const [searchedFiles, setSearchedFiles] = useState([])
  // 当前打开的文件
  const [activeFileID, setActiveFileID] = useState('')
  // 当前有那些打开的文件
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  // 当前未保存的文件
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])

  // 获取files对象，并将转化为数组
  const filesArr = objToArr(files)
  console.log("filesArr", filesArr);
  console.log("files", filesArr);
  const activeFile = files[activeFileID]
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr

  const savedLocation = remote.app.getPath("documents")
  // 从files过滤出打开的文件
  const openedFiles = openedFileIDs.map(openID => {
    // return files.find(file => file.id === openID)
    return files[openID]
  });
  // 
  // const activeFile = files.find(file => file.id === activeFileID)

  // 点击文件列表每一个文件的回调函数
  const fileClick = useCallback((fileID) => {
    console.log(fileID);
    setActiveFileID(fileID)
    const currentFile = files[fileID]
    // 读取文件的内容并存到持久化数据库中
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then((value) => {
        const newFile = {...files[fileID], body: value, isLoaded: true}
        setFiles({...files, [fileID]: newFile})
      })
    }
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
  }, [files, openedFileIDs])

  // 点击tab文件时候的回调
  const tabClick = useCallback((tabID) => {
    console.log(tabID);
    setActiveFileID(tabID)
  }, [])

  // 点击tab关闭某个tab
  const closeClick = useCallback((closeID) => {
    console.log(closeID);
    const tabsWithout = openedFileIDs.filter(open => open !== closeID);
    setOpenedFileIDs(tabsWithout)
    // 删除当前tab以后判断tabList是否还有，如果有就默认选中第一个
    if (openedFileIDs.length > 0) {
      setActiveFileID(tabsWithout[0])
    }else {
      setActiveFileID('')
    }
  }, [openedFileIDs])
  
  // md文本编辑回调
  const fileChange = useCallback((id, value) => {
    if (value !== files[id].body) {
      const newFile = { ...files[id], body: value }
      setFiles({ ...files, [id]: newFile })
      // update unsavedIDs
      if (!unsavedFileIDs.includes(id)) {
        setUnsavedFileIDs([ ...unsavedFileIDs, id])
      }
    }
  }, [files, unsavedFileIDs])
  // 删除文件列表中的某个文件
  const deleteFile = (id) => {
    if (files[id].isNew) {
      const { [id]: value, ...afterDelete } = files
      setFiles(afterDelete)
    } else {
      fileHelper.deleteFile(files[id].path).then(() => {
        const { [id]: value, ...afterDelete } = files
        console.log("onFileDelete", afterDelete);
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
        // close the tab if opened
        closeClick(id)
      })
    }
  }
  
  // 修改文件名 
  const updateFileName = useCallback((id, title, isNew) => {
    const newPath = isNew ? join(savedLocation, `${title}.md`): join(dirname(files[id].path), `${title}.md`)
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath }
    const newFiles = { ...files, [id]: modifiedFile }
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      const oldPath = files[id].path
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }
    // const newFiles = files.map(file => {
    //   if (file.id === id) {
    //     if (isNew) {
    //       fileHelper.writeFile(newPath, file.body).then(() => {
    //         setFiles(newFiles)
    //       })
    //     } else { 
    //       fileHelper.renameFile(join(savedLocation, `${file.title}.md`), join(savedLocation, `${title}.md`))
    //     }
    //     file.title = title
    //     file.isNew = false
    //     file.path = newPath
    //   }
    //   return file
    // })

    
  }, [files, savedLocation])
  
  // 搜索功能
  const onFileSearch = useCallback((keyword) => {
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }, [filesArr])
  // 新建文件
  const createNewFile = useCallback(() => {
    const newID = uuidv4()
    const newFile = {
      id: newID,
      title: '',
      body: '## 请输出 Markdown',
      createdAt: new Date().getTime(),
      isNew: true,
    }
    setFiles({ ...files, [newID]: newFile })
  }, [files])
  const saveCurrentFile = useCallback(() => {
    const { path, body, title } = activeFile
    fileHelper.writeFile(path, body).then(() => {
      setUnsavedFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id))
      // if (getAutoSync()) {
      //   ipcRenderer.send('upload-file', {key: `${title}.md`, path })
      // }
    })
  }, [activeFile, unsavedFileIDs])
  // 导入 md 文件
  const importFiles = useCallback(() => {
    ipcRenderer.send("selectFile")
  }, [])

  const getSelectFile = useCallback((event, paths) => {
    console.log(paths);
    if (Array.isArray(paths)) {
      // filter out the path we already have in electron store
      // ["/Users/liusha/Desktop/name1.md", "/Users/liusha/Desktop/name2.md"]
      const filteredPaths = paths.filter(path => {
        const alreadyAdded = Object.values(files).find(file => {
          return file.path === path
        })
        return !alreadyAdded
      })
      // extend the path array to an array contains files info
      // [{id: '1', path: '', title: ''}, {}]
      const importFilesArr = filteredPaths.map(path => {
        return {
          id: uuidv4(),
          title: basename(path, extname(path)),
          path,
        }
      })
      console.log(importFilesArr);
      // get the new files object in flattenArr
      const newFiles = { ...files, ...flattenArr(importFilesArr)}
      // setState and update electron store
      setFiles(newFiles)
      saveFilesToStore(newFiles)
      if (importFilesArr.length > 0) {
        remote.dialog.showMessageBox({
          type: 'info',
          title: `成功导入了${importFilesArr.length}个文件`,
          message: `成功导入了${importFilesArr.length}个文件`,
        })
      }
    }
  }, [files])

  useEffect(() => {
    ipcRenderer.on("getSelectFile", getSelectFile)
    return () => {
      ipcRenderer.removeAllListeners("getSelectFile")
    }
  }, [getSelectFile])
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters window-heigh">
        <div className="col-3 left-panel">
          <FileSearch title="我的云文档" onFileSearch={onFileSearch}></FileSearch>
          <FileList files={fileListArr} onFileClick={fileClick} onSaveEdit={updateFileName} onFileDelete={deleteFile}></FileList>
          <div className="row no-gutters left-btn-bottom">
            <div className="col">
              <BottomBtn text="新建" icon={faPlus} onBtnClick={createNewFile} colorClass="btn-primary" />
            </div>
            <div className="col">
              <BottomBtn text="导入" icon={faFileImport} onBtnClick={importFiles} colorClass="btn-success" />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          { !activeFile ? (<div className="start-page">
            请创建新的文件或选择已有的文件
          </div>): (
            <>
              <TableList 
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onCloseTab={closeClick}
                onTabClick={tabClick}
              />
              <SimpleMDE
                key={activeFile && activeFile.id }
                value={activeFile && activeFile.body}
                onChange={(value) => {fileChange(activeFile.id, value)}}
                options={{
                  minHeight: "450px"
                }}
              />
              <BottomBtn text="保存" icon={faSave} onBtnClick={saveCurrentFile} colorClass="btn-primary" />
            </>
          ) }
        </div>
      </div>
    </div>
  );
}

export default App;
