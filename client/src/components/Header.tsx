import { Link } from "wouter";

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <svg className="h-10 w-10 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h1 className="ml-3 text-2xl md:text-3xl font-bold font-playfair text-primary-700">BookMind</h1>
        </div>
        <nav className="flex flex-wrap justify-center space-x-1 sm:space-x-4">
          <Link href="/">
            <a className="px-3 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50 transition duration-150">Home</a>
          </Link>
          <Link href="/discover">
            <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition duration-150">Discover</a>
          </Link>
          <Link href="/library">
            <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition duration-150">My Library</a>
          </Link>
          <Link href="/about">
            <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition duration-150">About</a>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
