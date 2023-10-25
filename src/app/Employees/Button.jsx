
const Button = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-baseBlue rounded-lg text-white w-24 py-[3px]"
        >
            {text}
        </button>
    );
};

export default Button;
