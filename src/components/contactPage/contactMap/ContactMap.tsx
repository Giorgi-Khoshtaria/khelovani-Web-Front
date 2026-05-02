import React from "react";
import "./contactMap.scss";

const ContactMap = () => {
  return (
    <div className="contact-map">
      <div className="contact-map__container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.1287661570535!2d44.7778644766184!3d41.71775797615024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cc070a7df85%3A0xc3191f6305963f2b!2sTbilisi%2C%20Georgia!5e0!3m2!1sen!2sge!4v1714571234567!5m2!1sen!2sge"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Khelovani Location"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactMap;
