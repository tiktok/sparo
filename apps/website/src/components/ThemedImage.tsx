import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

/**
 * An `<img>` tag with a different URLs for light vs dark mode.
 */
const ThemedImage = ({ srcLight, srcDark, alt, title, style }) => {
  const { colorMode } = useColorMode();
  const src = colorMode === 'dark' ? srcDark : srcLight;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img src={src} alt={alt} title={title} style={style} />
    </div>
  );
};

export { ThemedImage };
