import { useEffect } from 'react';
import { usePageVisibility } from 'react-page-visibility';

export const useHandleVisibility = () => {
  const isVisible = usePageVisibility();

  useEffect(() => {
    const offline = '[offline] ';
    if (!isVisible) {
      document.title = `${offline}${document.title}`;
    }
    if (isVisible && document.title.includes(offline)) {
      document.title = document.title.replace(offline, '');
    }
  }, [isVisible]);
};
