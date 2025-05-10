import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';

interface HandleWithTitle {
  title?: string;
}

const TitleUpdater = () => {
  const matches = useMatches();

  useEffect(() => {
    const matchWithTitle = matches.find(
      (match) => (match.handle as HandleWithTitle)?.title
    );
    if (matchWithTitle) {
      const title = (matchWithTitle.handle as HandleWithTitle).title;
      if (title) {
        document.title = title;
      }
    }
  }, [matches]);

  return null;
};

export default TitleUpdater;
