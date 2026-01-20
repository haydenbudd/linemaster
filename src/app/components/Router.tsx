import { useState, useEffect } from 'react';

interface RouterProps {
  children: (path: string, navigate: (path: string) => void) => React.ReactNode;
}

export function Router({ children }: RouterProps) {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newPath: string) => {
    window.location.hash = newPath;
  };

  return <>{children(path, navigate)}</>;
}
