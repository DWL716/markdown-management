import { useCallback, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor'

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TableList from './components/TableList'
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons"; 

import defaultFiles from './utils/defaultFiles'

import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css";
import './App.css';

function App() {
  // markdown的所有数据
  const [files, setFiles] = useState(defaultFiles)
  // 用来搜索的数组
  const [searchedFiles, setSearchedFiles] = useState([])
  // 当前打开的文件
  const [activeFileID, setActiveFileID] = useState('')
  // 当前有那些打开的文件
  const [openedFileIDs, setOpenedFileIDs] = useState([])
  // 当前未保存的文件
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
  // 从files过滤出打开的文件
  const openedFiles = openedFileIDs.map(openID => {
    return files.find(file => file.id === openID)
  });
  // 
  const activeFile = files.find(file => file.id === activeFileID)

  // 点击文件列表每一个文件的回调函数
  const fileClick = useCallback((fileID) => {
    console.log(fileID);
    setActiveFileID(fileID)
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
  }, [openedFileIDs])

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
  const fileChange = useCallback((fileID, value) => {
    let newFiles = files.map(file => {
      if (file.id === fileID) {
        file.body = value
      }
      return file;
    });
    if (!unsavedFileIDs.includes(fileID)) {
      setUnsavedFileIDs([...unsavedFileIDs, fileID])
      setFiles(newFiles)
    }
  }, [files, unsavedFileIDs])
  // 删除文件列表中的某个文件
  const deleteFile = useCallback((fileID) => {
    const newFiles = files.filter(file => file.id !== fileID)
    setFiles(newFiles)
    closeClick(fileID)
  }, [closeClick, files])
  
  // 修改文件名
  const updateFileName = useCallback((id, title) => {
    console.log(id, title);
    const newFiles = files.map(file => {
      if (file.id === id) {
        file.title = title
      }
      return file
    })
    setFiles(newFiles)
  }, [files])
  
  // 搜索功能
  const onFileSearch = useCallback((value) => {
    console.log(value);
    const newFiles = files.filter(file => file.title.includes(value))
    setSearchedFiles(newFiles)
  }, [files])
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : files
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters window-heigh">
        <div className="col-3 left-panel">
          <FileSearch title="我的云文档" onFileSearch={onFileSearch}></FileSearch>
          <FileList files={fileListArr} onFileClick={fileClick} onSaveEdit={updateFileName} onFileDelete={deleteFile}></FileList>
          <div className="row no-gutters left-btn-bottom">
            <div className="col">
              <BottomBtn text="新建" icon={faPlus} onBtnClick={() => {}} colorClass="btn-primary" />
            </div>
            <div className="col">
              <BottomBtn text="导入" icon={faFileImport} onBtnClick={() => {}} colorClass="btn-success" />
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
                  minHeight: "510px"
                }}
              />
            </>
          ) }
        </div>
      </div>
    </div>
  );
}

export default App;
