import { FiBell, FiSettings } from 'react-icons/fi';
import './Header.scss';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">Mast Ativos</span>
      </div>
      <div className="header-center">
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar..."
        />
      </div>
      <div className="header-right">
        <FiBell className="header-icon" />
        <FiSettings className="header-icon" />
        <div className="avatar-wrapper">
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="Avatar"
            className="avatar"
          />
        </div>
      </div>
    </header>
  );
}
