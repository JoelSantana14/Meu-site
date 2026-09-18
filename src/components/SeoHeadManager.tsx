import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SeoHeadManager: React.FC = () => {
  const { siteConfig, activeTab, properties } = useApp();

  useEffect(() => {
    // 1. Determine Title
    let title = siteConfig.seoTitle || 'Joel Santana Corretor de Imóveis | Comprar e Alugar em São José do Rio Preto e Região - SP';
    if (activeTab === 'portal' || activeTab === '') {
      title = siteConfig.seoTitle || 'Joel Santana Corretor de Imóveis | Imóveis em São José do Rio Preto - SP';
    } else if (activeTab === 'quem-somos') {
      title = `Quem Somos | ${siteConfig.companyName || 'Joel Santana Corretor de Imóveis'} - São José do Rio Preto`;
    } else if (activeTab === 'indices-oficiais') {
      title = `Índices e Indicadores Imobiliários | ${siteConfig.companyName || 'Joel Santana'} - SJRP`;
    } else if (activeTab === 'noticias-mercado') {
      title = `Notícias do Mercado Imobiliário | ${siteConfig.companyName || 'Joel Santana'} - SJRP`;
    }

    document.title = title;

    // Helper to safely set or create meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const description = siteConfig.seoDescription ||
      'Encontre as melhores casas, apartamentos, condomínios fechados, terrenos e imóveis comerciais para comprar ou alugar em São José do Rio Preto - SP e região. Atendimento exclusivo com Joel Santana Corretor de Imóveis. WhatsApp: (17) 99195-1473.';

    const keywords = siteConfig.seoKeywords ||
      'imóveis são josé do rio preto, casas à venda são josé do rio preto, comprar casa rio preto, apartamentos alugar são josé do rio preto, aluguel são josé do rio preto, terrenos rio preto sp, corretor joel santana, joel santana corretor de imóveis, imobiliária são josé do rio preto, casas em condomínio fechado rio preto, chácaras rio preto, locação de imóveis rio preto sp';

    const canonicalUrl = siteConfig.seoCanonicalUrl || 'https://joelsantanacorretor.com.br';
    const ogImage = siteConfig.seoOgImageUrl || '/images/house_with_pool_1789524615804.jpg';
    const city = siteConfig.seoCity || 'São José do Rio Preto';
    const state = siteConfig.seoState || 'SP';
    const robots = siteConfig.seoRobotsIndex !== false ? 'index, follow' : 'noindex, nofollow';

    // 2. Set Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', siteConfig.brokerName || siteConfig.companyName || 'Joel Santana Corretor de Imóveis');
    setMetaTag('name', 'robots', robots);
    setMetaTag('name', 'googlebot', robots);

    // 3. Geographic SEO Tags (São José do Rio Preto - SP)
    setMetaTag('name', 'geo.region', `BR-${state}`);
    setMetaTag('name', 'geo.placename', city);
    setMetaTag('name', 'geo.position', '-20.8113;-49.3758');
    setMetaTag('name', 'ICBM', '-20.8113, -49.3758');

    // 4. Open Graph Tags (WhatsApp, Facebook, LinkedIn)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', siteConfig.companyName || 'Joel Santana Corretor de Imóveis');
    setMetaTag('property', 'og:locale', 'pt_BR');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Google Search Console Verification
    if (siteConfig.seoGoogleSearchConsole) {
      const gscCode = siteConfig.seoGoogleSearchConsole.replace('google-site-verification=', '').trim();
      setMetaTag('name', 'google-site-verification', gscCode);
    }

    // 7. Canonical URL Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 8. Schema.org RealEstateAgent & LocalBusiness Structured Data (JSON-LD)
    if (siteConfig.seoStructuredDataEnabled !== false) {
      let scriptEl = document.getElementById('schema-structured-data');
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'schema-structured-data';
        scriptEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptEl);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': ['RealEstateAgent', 'LocalBusiness'],
        'name': siteConfig.companyName || 'Joel Santana Corretor de Imóveis',
        'legalName': siteConfig.brokerName || 'Joel Santana',
        'description': description,
        'url': canonicalUrl,
        'image': ogImage,
        'telephone': siteConfig.phone || '(17) 99195-1473',
        'priceRange': 'R$ 150.000 - R$ 15.000.000',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': city,
          'addressRegion': state,
          'addressCountry': 'BR'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': -20.8113,
          'longitude': -49.3758
        },
        'areaServed': [
          {
            '@type': 'City',
            'name': 'São José do Rio Preto'
          },
          {
            '@type': 'City',
            'name': 'Mirassol'
          },
          {
            '@type': 'City',
            'name': 'Bady Bassitt'
          },
          {
            '@type': 'City',
            'name': 'Cedral'
          }
        ],
        'sameAs': [
          siteConfig.instagramUrl || '',
          siteConfig.facebookUrl || '',
          siteConfig.youtubeUrl || '',
          siteConfig.linkedinUrl || ''
        ].filter(Boolean)
      };

      scriptEl.textContent = JSON.stringify(structuredData, null, 2);
    }

  }, [
    siteConfig.seoTitle,
    siteConfig.seoDescription,
    siteConfig.seoKeywords,
    siteConfig.seoCanonicalUrl,
    siteConfig.seoOgImageUrl,
    siteConfig.seoGoogleSearchConsole,
    siteConfig.seoCity,
    siteConfig.seoState,
    siteConfig.seoRegion,
    siteConfig.seoRobotsIndex,
    siteConfig.seoStructuredDataEnabled,
    siteConfig.companyName,
    siteConfig.brokerName,
    siteConfig.phone,
    siteConfig.instagramUrl,
    siteConfig.facebookUrl,
    siteConfig.youtubeUrl,
    siteConfig.linkedinUrl,
    activeTab
  ]);

  return null;
};
