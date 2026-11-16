import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

interface RouterContextType {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({
  href,
  children,
  className,
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      href.startsWith('http') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      onClick?.(e);
      return;
    }
    e.preventDefault();
    onClick?.(e);
    navigate(href);
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

interface RouterProps {
  children: ReactNode;
}

export function Router({ children }: RouterProps) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((newPath: string) => {
    window.history.pushState(null, '', newPath);
    setPath(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

interface RouteProps {
  path: string;
  component: React.ComponentType;
}

export function Routes({ routes }: { routes: RouteProps[] }) {
  const { path } = useRouter();
  for (const route of routes) {
    if (route.path === path || (route.path === '/' && (path === '/index.html' || path === ''))) {
      return <route.component />;
    }
  }
  const Home = routes[0]?.component;
  return Home ? <Home /> : null;
}
