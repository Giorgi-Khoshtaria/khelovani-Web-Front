import React from "react";
import ContactHero from "@/components/contactPage/contactHero/ContactHero";
import ContactForm from "@/components/contactPage/contactForm/ContactForm";
import ContactInfo from "@/components/contactPage/contactInfo/ContactInfo";
import ContactMap from "@/components/contactPage/contactMap/ContactMap";
import "./contact.scss";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Khelovani for any inquiries about our products, artisans, or anything else.",
};

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
