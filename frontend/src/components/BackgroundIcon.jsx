import React, { memo } from 'react';

const BackgroundIcon = (props) => (
  <svg preserveAspectRatio='none' viewBox='0 0 317 54' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M0 15.6224C0 6.99438 6.99438 0 15.6224 0H301.378C310.006 0 317 6.99438 317 15.6224V38.3776C317 47.0056 310.006 54 301.378 54H15.6224C6.99437 54 0 47.0056 0 38.3776V15.6224Z'
      fill='#9370DB'
    />
  </svg>
);

const MemoizedBackgroundIcon = memo(BackgroundIcon);
export { MemoizedBackgroundIcon as BackgroundIcon };
