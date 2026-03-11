import { useEffect, useState, useRef } from 'react';

interface ServerContextMenuProps {
  children: React.ReactNode;
  server: any;
  visibleMenuId: any;
  setVisibleMenuId: (id: any) => void;
  editServer: (server: any) => void;
  deleteServer: (server: any) => void;
}

const ServerContextMenu = ({ children, server, visibleMenuId, setVisibleMenuId, editServer, deleteServer }: ServerContextMenuProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLUListElement>(null);

  const isVisible = visibleMenuId === server.id;

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setVisibleMenuId(server.id);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setVisibleMenuId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" onContextMenu={handleContextMenu}>
      {children}
      {isVisible && (
        <ul
          ref={menuRef}
          className="fixed bg-gray-800 text-white rounded shadow-md w-48 z-50"
          style={{ top: position.y, left: position.x }}
        >
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => setVisibleMenuId(null)}
          >
            Invite People
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => setVisibleMenuId(null)}
          >
            Edit Server
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => deleteServer(server)}
          >
            Leave Server
          </li>
        </ul>
      )}
    </div>
  );
};

export default ServerContextMenu;