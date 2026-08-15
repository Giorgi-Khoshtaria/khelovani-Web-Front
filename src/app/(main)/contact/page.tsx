import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import ContactHero from "@/components/contactPage/contactHero/ContactHero";
import ContactForm from "@/components/contactPage/contactForm/ContactForm";
import ContactInfo from "@/components/contactPage/contactInfo/ContactInfo";
import ContactMap from "@/components/contactPage/contactMap/ContactMap";
import { getPageByPath } from "@/apiCalls/pageRequests/page.req";
import { Lang } from "@/lib/types/lang.types";
import { buildPageMetadata } from "@/lib/utils/seo";
import "./contact.scss";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  try {
    const page = await getPageByPath("/contact");
    return buildPageMetadata({
      path: "/contact",
      title: lang === "ge" ? page.title.ka : page.title.en,
      description: lang === "ge" ? page.description.ka : page.description.en,
      ogImage: page.ogImage,
      noindex: page.noindex,
    });
  } catch {
    return buildPageMetadata({
      path: "/contact",
      title: "Contact Us",
      description:
        "Get in touch with Khelovani for any inquiries about our products, artisans, or anything else.",
    });
  }
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactHero />
      
      <div className="contact-page__content">
        <ContactForm />
        <ContactInfo />
      </div>

      <ContactMap />
    </div>
  );
}
