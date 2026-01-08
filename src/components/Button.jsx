function Button(
    {
        type,
        text,
        onClick,
        disabled,
        buttonType = "button"
    }
){
    return (
        <button
            onClick={onClick} 
            disabled={disabled}     
            className={`${baseClasses} ${typeClasses[type]}`}
            type = {buttonType}
        >
            {text}

        </button>
    )
}

// types expected: prymary, secondary, danger, success, warning 

export default Button

const baseClasses = "px-6 py-2 font-medium transition-colors rounded-lg"
const typeClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-800",
    secondary: "bg-gray-600 text-white hover:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-800",
    success: "bg-green-600 text-white hover:bg-red-800",
    warning: "bg-yellow-600 text-white hover:bg-yellow-800",
}