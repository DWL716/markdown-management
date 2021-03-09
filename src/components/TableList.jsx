/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes  from 'prop-types'
import { useCallback } from 'react'

function  TableList({files, activeId, unsaveIds, onTabClick, onCloseTab}) {
  return (
    <ul className="nav nav-pills">
      {
        files.map(file => (
          <li className="nav-item" key={file.id}>
            <a href="#" onClick={(e) => {e.preventDefault(); onTabClick(file.id)}}>{file.title}</a>
          </li>
        ))
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