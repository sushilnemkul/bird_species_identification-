import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-light">
            <Sidebar />
            <div className="ml-64 p-8 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
            <ToastContainer position="bottom-right" theme="colored" />
        </div>
    );
};

export default MainLayout;
