import logo from "../assets/images/logo.png";

const PageLoader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <img src={logo} className="inline-block w-20 animate-spin" alt="logo" />
                <p className="text-gray-600 mt-4">Loading...</p>
            </div>
        </div>
    );
}

export default PageLoader;
