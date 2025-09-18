import React from 'react';

/**
 * OptimizedImage - usa <picture> para servir versão webp quando disponível.
 * Props:
 *  - src: caminho original (ex: assets/images/foto.jpg)
 *  - alt: texto alternativo
 *  - className: classes extras
 *  - width/height: dimensões (para evitar layout shift)
 *  - loading: 'lazy' por padrão
 *  - decoding: 'async'
 */
export default function OptimizedImage({ src, alt = '', className = '', width, height, loading = 'lazy', decoding = 'async', ...rest }) {
  const dot = src.lastIndexOf('.');
  const base = dot !== -1 ? src.substring(0, dot) : src;
  const webp = base + '.webp';
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        style={{ display: 'block', width: width ? undefined : '100%' }}
        {...rest}
      />
    </picture>
  );
}
