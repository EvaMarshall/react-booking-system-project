function Header() {
    return (
        <header className="p-8 flex flex-col items-center">
            <div className="flex justify-center items-center flex-col">
                <img 
                    src="/logo.png" 
                    alt="BrechfaForest Logo" 
                    className="w-[40vw] max-w-[200px] sm:w-[30vw] md:w-[20vw]"
                />
                <span 
                    className="text-3xl font-bold ml-6 w-[40vw] sm:w-[30vw] md:w-[20vw] text-center"
                >
                    BrechfaForest.com
                </span>
            </div>
            {/* Thin Green Line Divider */}
            <div className="w-full border-t-2 border-green-700 mt-4"></div>
        </header>
    );
}


export default Header;
