import { useEffect, useState } from 'react';

import { isMobileDevice } from '@/utils/is-mobile';

export default function useIsMobile() {
  const [mobile, setMobile] = useState(isMobileDevice());

  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobileDevice());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mobile;
}
