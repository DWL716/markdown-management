import { useCallback } from 'react';

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TableList from './components/TableList'
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons"; 

import defaultFiles from './utils/defaultFiles'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

function App() {
  const onFileSearch = useCallback((value) => {
    console.log(value);
  }, [])
  const onFileClick = useCallback((value) => {
    console.log(onFileClick);
  }, [])
  const onSaveEdit = useCallback((id) => {
    console.log("edit", id);
  }, [])
  const onFileDelete = useCallback((id) => {
    console.log("del", id);
  }, [])
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters window-heigh">
        <div className="col-3 left-panel">
          <FileSearch title="我的云文档" onFileSearch={onFileSearch}></FileSearch>
          <FileList files={defaultFiles} onFileClick={onFileClick} onSaveEdit={onSaveEdit} onFileDelete={onFileDelete}></FileList>
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
          <TableList 
            files={defaultFiles}
            activeId="1"
            onTabClick={(id) => {console.log(id);}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
