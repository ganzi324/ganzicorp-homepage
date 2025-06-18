import Script from 'next/script'

interface OrganizationData {
  name: string
  url: string
  logo?: string
  description?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
    email?: string
  }
  sameAs?: string[]
}

interface WebsiteData {
  name: string
  url: string
  description?: string
  publisher?: {
    name: string
    url: string
  }
}

interface StructuredDataProps {
  organization?: OrganizationData
  website?: WebsiteData
}

export default function StructuredData({ organization, website }: StructuredDataProps) {
  const organizationSchema = organization ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organization.name,
    "url": organization.url,
    "logo": organization.logo,
    "description": organization.description,
    "address": organization.address ? {
      "@type": "PostalAddress",
      "streetAddress": organization.address.streetAddress,
      "addressLocality": organization.address.addressLocality,
      "addressRegion": organization.address.addressRegion,
      "postalCode": organization.address.postalCode,
      "addressCountry": organization.address.addressCountry
    } : undefined,
    "contactPoint": organization.contactPoint ? {
      "@type": "ContactPoint",
      "telephone": organization.contactPoint.telephone,
      "contactType": organization.contactPoint.contactType,
      "email": organization.contactPoint.email
    } : undefined,
    "sameAs": organization.sameAs
  } : null

  const websiteSchema = website ? {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": website.name,
    "url": website.url,
    "description": website.description,
    "publisher": website.publisher ? {
      "@type": "Organization",
      "name": website.publisher.name,
      "url": website.publisher.url
    } : undefined
  } : null

  return (
    <>
      {organizationSchema && (
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
      )}
      {websiteSchema && (
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
      )}
    </>
  )
} 