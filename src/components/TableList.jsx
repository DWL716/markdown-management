/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes  from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import './TableList.scss'
function  TableList({files, activeId, unsaveIds, onTabClick, onCloseTab}) {
  return (
    <ul className="nav nav-pills tableList-component">
      {
        
        files.map(file => {
          const withUnsavedMark = unsaveIds.includes(file.id)
          const fClassnames = classNames({
            "nav-link": true,
            "active": file.id === activeId,
            "withUnsaved": withUnsavedMark,
          })
          return (
          <li className="nav-item" key={file.id}>
            <a href="#"  className={fClassnames} onClick={(e) => {e.preventDefault(); onTabClick(file.id)}}>
              {file.title}
              <span className="col-2 font-markdown-padding close-icon" onClick={(e) => {e.stopPropagation(); onCloseTab(file.id)}}>
                <FontAwesomeIcon icon={faTimes} className="ml-2" />
              </span>
              {withUnsavedMark && <span className="rounded-circle ml-2 unsaved-icon"></span>}
            </a>
          </li>
        )})
      }
    </ul>
  )
}

TableList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unsaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onCloseTab: PropTypes.func,
}

TableList.defaultProps = {
unsaveIds: []
}

export default TableList