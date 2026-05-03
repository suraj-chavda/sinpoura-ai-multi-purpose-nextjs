import { APP_NAME } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site";

const DESCRIPTION =
  "Multi-purpose AI chat built with Next.js, MongoDB, Zustand, Auth.js, and xoin-js—a structured multi-LLM toolkit across OpenAI, Anthropic, and other providers.";

export function JsonLd() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    description: DESCRIPTION,
    url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: APP_NAME,
      url,
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
