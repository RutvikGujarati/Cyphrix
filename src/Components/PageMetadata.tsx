import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPage, siteUrl, socialImage, structuredData } from '../seo';

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = getPage(pathname);
    document.title = page.title;
    for (const [attribute, key, value] of [
      ['name', 'description', page.description],
      ['property', 'og:title', page.title],
      ['property', 'og:description', page.description],
      ['property', 'og:url', `${siteUrl}${page.path}`],
      ['property', 'og:image', socialImage],
      ['name', 'twitter:title', page.title],
      ['name', 'twitter:description', page.description],
      ['name', 'twitter:image', socialImage],
    ]) {
      let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.append(meta);
      }
      meta.content = value;
    }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = `${siteUrl}${page.path}`;
    let schema = document.getElementById('site-schema');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'site-schema';
      schema.setAttribute('type', 'application/ld+json');
      document.head.append(schema);
    }
    schema.textContent = JSON.stringify(structuredData(pathname));
  }, [pathname]);
  return null;
}
