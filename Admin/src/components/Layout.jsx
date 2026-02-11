import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 ml-64">
                {children}
            </div>
        </div>
    );
};

export default Layout;
