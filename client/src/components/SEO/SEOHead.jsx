import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * Composant SEO centralisé pour gérer tous les meta tags
 * Optimisé pour le référencement de TalentProof en Belgique
 */
const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  noindex = false,
  schema
}) => {
  // Valeurs par défaut optimisées SEO
  const defaultTitle = 'TalentProof - Plateforme de Recrutement Tech en Belgique | Développeurs Certifiés';
  const defaultDescription = 'Recrutez les meilleurs développeurs certifiés en Belgique (Wallonie & Bruxelles). TalentDays, tests techniques validés, portfolios vérifiés. Plateforme #1 pour le recrutement tech.';
  const defaultKeywords = 'recrutement développeur Belgique, talents tech Wallonie, plateforme recrutement tech Bruxelles, développeur certifié Belgique, TalentDays Belgique, tests techniques développeurs, portfolio développeur validé';
  const siteUrl = 'https://talentproof.be';
  const defaultOgImage = `${siteUrl}/og-image.jpg`;

  // Titre final (avec suffixe TalentProof si pas déjà présent)
  const finalTitle = title
    ? title.includes('TalentProof')
      ? title
      : `${title} | TalentProof`
    : defaultTitle;

  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const finalOgImage = ogImage || defaultOgImage;

  // Robots meta
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="TalentProof" />
      <meta property="og:locale" content="fr_BE" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={finalCanonical} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:creator" content="@TalentProof" />
      
      {/* Language */}
      <link rel="alternate" hreflang="fr-BE" href={finalCanonical} />
      <link rel="alternate" hreflang="fr" href={finalCanonical} />
      <link rel="alternate" hreflang="x-default" href={finalCanonical} />
      
      {/* Schema.org JSON-LD (si fourni) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

SEOHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonical: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  twitterCard: PropTypes.string,
  noindex: PropTypes.bool,
  schema: PropTypes.object
};

export default SEOHead;
