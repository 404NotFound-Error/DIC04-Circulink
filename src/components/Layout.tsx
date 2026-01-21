import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#315238' }}>
      <div className="flex">
        {sidebar && (
          <aside className="hidden lg:block w-64 border-r min-h-screen sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"style={{ backgroundColor: '#18360d' }}>
            {sidebar}
          </aside>
        )}

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
