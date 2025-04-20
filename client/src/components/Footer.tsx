import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <svg className="h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="ml-2 text-xl font-playfair font-bold text-white">BookMind</h2>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered book recommendations tailored to your unique preferences. Discover your next favorite read with the power of Google Gemini.
            </p>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} BookMind. All rights reserved.</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/discover">
                  <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">Discover</div>
                </Link>
              </li>
              <li>
                <Link href="/library">
                  <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">My Library</div>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">About</div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact">
                  <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact Us</div>
                </Link>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  GitHub Repo
                </a>
              </li>
              <li>
                <Link href="/api-docs">
                  <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">API Documentation</div>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
