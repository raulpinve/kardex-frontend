import { RiLoader4Fill  } from "react-icons/ri";

const Button = ({ type, loading, colorButton, textButton, onClick, children }) => {
  return (
    <button 
        type={type}
        className={`button-form ${loading ? "button-form-disabled": `button-form-${colorButton}`}`}
        disabled={loading}
        onClick={onClick}
    >
        { loading && <RiLoader4Fill className="animate-spin" />}
        { textButton || children }
    </button>
  )
}

export default Button