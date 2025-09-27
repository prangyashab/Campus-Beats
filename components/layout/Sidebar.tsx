
import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { AppContextType, View } from '../../types';
import { ICONS } from '../../constants';
import UploadModal from '../ui/UploadModal';
import apiService from '../../services/apiService';

interface SidebarProps {
    onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMobileClose }) => {
    const context = useContext(AppContext);
    
    if (!context) {
        return <div>Loading...</div>;
    }
    
    const { view, setView, user, setSelectedPlaylist, setUser } = context;
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const navItems = [
        { name: View.Home, icon: ICONS.home },
        { name: View.Playlist, icon: ICONS.playlist },
        { name: View.FocusTimer, icon: ICONS.focusTimer },
        { name: View.Leaderboard, icon: ICONS.leaderboard },
        { name: View.Radio, icon: ICONS.radio },
        { name: View.ListeningRoom, icon: ICONS.listeningRoom },
    ];

    const handleLogout = async () => {
        try {
            // Call backend logout endpoint
            await apiService.auth.logout();
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            // Clear local storage and reset state regardless of API call result
            localStorage.removeItem('authToken');
            
            // Reset user state in context
            setUser(null);
            
            // Reload the page to reset all state
            window.location.reload();
        }
    }

    return (
        <>
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col p-4 border-r border-gray-700 h-full">
                <div className="text-2xl font-bold text-purple-400 mb-8">Campus Beats</div>
                <nav className="flex-1">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.name} className="mb-2">
                                <a
                                    href="#"
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        if (item.name === View.Playlist) {
                                            setSelectedPlaylist(null);
                                        }
                                        setView(item.name);
                                        // Close mobile menu when navigation item is clicked
                                        if (onMobileClose) {
                                            onMobileClose();
                                        }
                                    }}
                                    className={`flex items-center p-3 rounded-lg transition-colors ${view === item.name ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                                >
                                    {item.icon}
                                    <span className="ml-4">{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-auto">
                     <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors mb-4"
                    >
                        {ICONS.upload}
                        Upload Track
                    </button>
                    <div className="border-t border-gray-700 pt-4">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-400">{user?.points} points</p>
                        <button onClick={handleLogout} className="w-full flex items-center text-sm text-gray-400 hover:text-white mt-2">
                          {ICONS.logout}
                          Logout
                        </button>
                    </div>
                </div>
            </aside>
            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </>
    );
};

export default Sidebar;
