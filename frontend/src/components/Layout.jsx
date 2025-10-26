import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-night dark:text-slate-100">
    <Navbar />
    <main className="mx-auto flex min-h-[calc(100vh-200px)] max-w-6xl flex-col gap-16 px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
