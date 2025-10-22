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
    link: '#',
    children: [
      { label: 'Novo ativo', link: '#' },
      { label: 'Inventário', link: '#' },
    ],
  },
  {
    label: 'Configurações',
    icon: <FiSettings />,
    link: '#',
  },
];

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleMenu = (idx: number) => {
    setOpenMenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item, idx) => (
            <li key={item.label}>
              <div
                className={`menu-item${item.children ? ' has-children' : ''}`}
                onClick={() => item.children && toggleMenu(idx)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                {item.children && (
                  <span className="menu-chevron">
                    {openMenus[idx] ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                )}
              </div>
              {item.children && openMenus[idx] && (
                <ul className="submenu">
                  {item.children.map((sub) => (
                    <li key={sub.label}>
                      <Link to={sub.link} className="submenu-item">
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
