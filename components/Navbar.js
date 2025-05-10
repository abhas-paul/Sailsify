import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg z-50">
            <nav className="flex items-center justify-between px-4 py-3 relative">
                {/* Logo */}
                <div className="flex items-center gap-3 text-purple-700 text-xl font-bold tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>Sailsify</div>

                {/* Hamburger Toggle */}
                <input type="checkbox" id="menu-toggle" className="peer hidden" />
                <label htmlFor="menu-toggle" className="md:hidden text-purple-700 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </label>

                {/* Nav Menu */}
                <ul className="peer-checked:flex hidden md:flex flex-col md:flex-row items-center justify-center text-center md:items-center md:justify-start md:text-left absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent text-purple-700 font-medium space-y-3 md:space-y-0 md:space-x-6 border-t border-white/10 py-4 md:py-0">


                    <li>
                        <Link href="/" className="relative flex items-center justify-center gap-2 px-4 py-2 hover:text-purple-500 transition after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
                            </svg>
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link href="/FindOne" className="relative flex items-center justify-center gap-2 px-4 py-2 hover:text-purple-500 transition after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                <line x1="16.65" y1="16.65" x2="21" y2="21" strokeWidth="2" />
                            </svg>
                            Search
                        </Link>
                    </li>

                    <li>
                        <Link href="library" className="relative flex items-center justify-center gap-2 px-4 py-2 hover:text-purple-500 transition after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
                                <path d="M7 4v16M17 4v16" strokeWidth="2" />
                            </svg>
                            Library
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/CreatePlaylist"
                            className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-full border-2 text-sm border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white active:bg-purple-700 active:text-white transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeWidth="2" d="M12 5v14M5 12h14" />
                            </svg>
                            Create Playlist
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
