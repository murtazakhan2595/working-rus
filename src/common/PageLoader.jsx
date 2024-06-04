const PageLoader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
                <p className="text-gray-600 mt-4">Loading...</p>
            </div>
        </div>
    )
}

export default PageLoader