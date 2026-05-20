import { Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from '../components/navbar/Navbar';
const Footer = lazy(() => import('../components/Footer'));
export default function MainLayout() {
  return (
    <section>
    <Navbar/>
    <div className='max-w-7xl m-auto grid place-content-center p-3'>
    <Outlet/>
    </div>
   <Suspense fallback={<div className="p-2 text-center">Loading footer...</div>}>
    <Footer />
    </Suspense>
    </section>
  )
}
