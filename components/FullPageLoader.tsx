const FullPageLoader = () => {
    return (
        <div id="full-page-loader"
         className="modal" 
        >
            <div id="loading-indicator">
                <div className="lds-hourglass"></div>
            </div>
        </div>
    )
}

export default FullPageLoader