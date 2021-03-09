import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function BottomBtn({text,  colorClass, icon, onBtnClick}) {
  return (
    <button 
      type="button"
      className={`btn btn-block no-border ${colorClass}`}
      onClick={onBtnClick}
    >
      <FontAwesomeIcon className="mr-2" title={text} size="lg" icon={icon} />
      {text}
    </button>
  )
}

BottomBtn.propTypes = {
  text: PropTypes.string,
  colorClass: PropTypes.string,
  icon: PropTypes.object.isRequired,
  onBtnClick: PropTypes.func
}
export default BottomBtn;