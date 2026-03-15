export interface FAQItem {
    question: string;
    answer: string;
}

export interface FeatureItem {
    title: string;
    description: string;
}

export interface PageSEOContent {
    metadata: {
        title: string;
        description: string;
    };
    jsonLd: {
        name: string;
        description: string;
        url: string;
    };
    hero: {
        title: string;
        subtitle: string;
        cta: string;
    };
    intro: {
        title: string;
        content: string[]; // HTML supported
    };
    features: {
        title: string;
        items: FeatureItem[];
    };
    section3?: { // Optional additional section
        title: string;
        content: string;
    };
    faq: {
        title: string;
        items: FAQItem[];
    };
}

export interface SubPageContent {
    metadata: {
        title: string;
        description: string;
    };
    children?: {
        label: string;
        desc: string;
        href: string;
        icon?: string;
    }[];
    hero: {
        title: string;
        subtitle: string;
        cta?: string; // Optional CTA text
        ctaHref?: string; // Optional CTA link override
        secondaryCta?: string; // Optional secondary button text
        secondaryCtaHref?: string; // Optional secondary button link
        useGateway?: boolean; // Control gateway trigger
    };
    intro?: {
        title: string;
        content: string[];
    };
    // New field for long SEO articles
    seoArticle?: {
        title: string; // H2
        sections: {
            heading?: string; // H3
            content: string; // HTML content
        }[];
    };
    features?: {
        title: string;
        items: FeatureItem[];
    };
    faq?: {
        title: string;
        items: FAQItem[];
    };
    layoutType?: 'default' | 'tutorial-hub';
    tutorialCategories?: {
        name: string;
        items: {
            title: string;
            href: string;
        }[];
    }[];
    sections?: {
        title: string;
        description?: string;
        content?: string;
        steps?: {
            title: string;
            content: string;
        }[];
    }[];
}

export interface SiteConfig {
    homepage: PageSEOContent;
    appPage: SubPageContent;
    pcPage: SubPageContent;
    webPage: SubPageContent;
    walletPage: SubPageContent;
    okbPage: SubPageContent;
    registerPage: SubPageContent;
    downloadCenterPage: SubPageContent;
    aboutPage: SubPageContent;
    iosPage: SubPageContent;
    androidPage: SubPageContent;
}
