import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="pb-5">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default PublicLayout;
