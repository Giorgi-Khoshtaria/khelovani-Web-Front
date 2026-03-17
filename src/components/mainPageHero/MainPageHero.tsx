import Link from "next/link";
import "./mainPageHero.scss";
import Image from "next/image";

function MainPageHero() {
  const main_hero_text =
    "აღმოაჩინეთ ნამდვილი ქართული ხელოვნება და ხელნაკეთი ნივთები, რომლებიც შექმნილია ოსტატი ხელოსნების მიერ. თითოეული ნამუშევარი მოგვითხრობს ტრადიციის, უნარებისა და კულტურული მემკვიდრეობის ისტორიას, რომელიც თაობიდან თაობას გადაეცემა.";

  return (
    <section className="hero">
      <span
        className="hero__bg-element hero__bg-element--1"
        aria-hidden="true"
      ></span>
      <span
        className="hero__bg-element hero__bg-element--2"
        aria-hidden="true"
      ></span>
      <div className="hero__inner">
        <div className="hero__content">
          <Image
            className="hero__logo"
            src="/assets/logo.png"
            width={150}
            height={150}
            alt="logo"
          />
          <p className="hero__text">{main_hero_text}</p>
        </div>

        <div className="hero__actions">
          <Link href="/products" className="hero__btn hero__btn--primary">
            აღმოაჩინე კოლექცია
          </Link>
          <Link href="/partners" className="hero__btn hero__btn--secondary">
            აღმოაჩინე პარტნიორები
          </Link>
          <Link href="/become-partner" className="hero__btn hero__btn--ghost">
            გახდი პარტნიორი
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MainPageHero;
