import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import SearchPage from './pages/SearchPage.jsx';
import RecipePage from './pages/RecipePage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function tabClass({ isActive }) {
  return isActive ? 'tab active' : 'tab';
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="app-shell">
          <header className="topbar">
            <span className="brand">Recipe Browser</span>
            <nav className="tabs">
              <NavLink to="/" end className={tabClass}>
                Search
              </NavLink>
              <NavLink to="/library" className={tabClass}>
                Library
              </NavLink>
              <NavLink to="/settings" className={tabClass}>
                Settings
              </NavLink>
            </nav>
          </header>
          <main className="content">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppProvider>
  );
}
