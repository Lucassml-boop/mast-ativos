import { useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiBox,
} from 'react-icons/fi';
import './Sidebar.scss';
import { Link } from 'react-router-dom';

const menuItems = [
  {
    label: 'Dashboard',
    icon: <FiHome />,
    link: '#',
  },
  {
    label: 'Usuários',
    icon: <FiUsers />,
    link: '#',
    children: [
      { label: 'Cadastro', link: '#' },
      { label: 'Listagem', link: '/admin' },
    ],
  },
  {
    label: 'Ativos',
    icon: <FiBox />,
    link: '/ativos',
    children: [
      { label: 'Novo ativo', link: '/' },
      { label: 'Inventário', link: '/ativos' },
    ],
  },
  {
    label: 'Configurações',
    icon: <FiSettings />,
    link: '#',
  },
];

export default function Sidebar({ open, onNavigate, onEnsureOpen }: { open?: boolean; onNavigate?: () => void; onEnsureOpen?: () => void }) {
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleMenu = (idx: number) => {
    setOpenMenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item, idx) => (
            <li key={item.label}>
              <div
                className={`menu-item${item.children ? ' has-children' : ''}`}
                data-label={item.label}
                role="button"
                tabIndex={0}
                onClick={() => {
                  // If sidebar is closed (compact), clicking should open it and also open submenu
                  if (!open) {
                    onEnsureOpen && onEnsureOpen();
                    if (item.children) toggleMenu(idx);
                    return;
                  }
                  if (item.children) toggleMenu(idx);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!open) {
                      onEnsureOpen && onEnsureOpen();
                      if (item.children) toggleMenu(idx);
                      return;
                    }
                    if (item.children) toggleMenu(idx);
                  }
                }}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                {item.children && (
                  <span className="menu-chevron">
                    {openMenus[idx] ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                )}
              </div>
              {item.children && (
                <ul className={`submenu ${openMenus[idx] ? 'open' : ''}`}>
                  {item.children.map((sub) => (
                    <li key={sub.label}>
                      <Link to={sub.link} className="submenu-item" onClick={() => onNavigate && onNavigate()}>
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
