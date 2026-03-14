import "./partnerRegistration.scss";
import { Link } from "react-router-dom";
import arrowLeft from "/assets/arrow-left-solid-full.svg";

function PartnerRegistration() {
  return (
    <div className="registration-page">
      <div className="registration-page__form">
        <div className="registration-content">
          <h2>პარტნიორის რეგისტრაცია</h2>
          <p>შეავსე ფორმა და გახდი ჩვენი პლატფორმის პარტნიორი</p>
        </div>

        <form className="registration-form__inputs">
          {/* 2 cols: Company names */}
          <div className="form-group">
            <label htmlFor="companyNameGe">კომპანიის სახელი (ქართულად)</label>
            <input
              type="text"
              id="companyNameGe"
              placeholder="კომპანიის სახელი"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyNameEn">კომპანიის სახელი (ლათინურად)</label>
            <input type="text" id="companyNameEn" placeholder="Company Name" />
          </div>

          {/* Full width: ID code */}
          <div className="form-group form-group--full">
            <label htmlFor="identificationCode">საიდენტიფიკაციო კოდი</label>
            <input
              type="text"
              id="identificationCode"
              placeholder="9-ნიშნა საიდენტიფიკაციო კოდი"
              maxLength={9}
            />
          </div>

          {/* 2 cols: Contact person + Phone */}
          <div className="form-group">
            <label htmlFor="contactPerson">საკონტაქტო პირის სახელი</label>
            <input type="text" id="contactPerson" placeholder="სახელი გვარი" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">ტელეფონის ნომერი</label>
            <input type="tel" id="phone" placeholder="+995 5XX XXX XXX" />
          </div>

          {/* 2 cols: City + Email */}
          <div className="form-group">
            <label htmlFor="city">ქალაქი</label>
            <select id="city" defaultValue="">
              <option value="" disabled>
                აირჩიე ქალაქი
              </option>
              <option value="tbilisi">თბილისი</option>
              <option value="batumi">ბათუმი</option>
              <option value="kutaisi">ქუთაისი</option>
              <option value="rustavi">რუსთავი</option>
              <option value="gori">გორი</option>
              <option value="zugdidi">ზუგდიდი</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">ელ. ფოსტა</label>
            <input type="email" id="email" placeholder="company@example.com" />
          </div>

          {/* Full width: Address */}
          <div className="form-group form-group--full">
            <label htmlFor="address">მისამართი</label>
            <input type="text" id="address" placeholder="ქუჩა, შენობა, ოფისი" />
          </div>

          {/* Full width: Short description */}
          <div className="form-group form-group--full">
            <label htmlFor="description">
              კომპანიის მოკლე აღწერა
              <span className="label-hint">
                რამდენიმე წინადადებით აღწერე შენი კომპანია
              </span>
            </label>
            <textarea
              id="description"
              placeholder="მაგ: ჩვენ ვართ ქართული ხელნაკეთი სამკაულების მწარმოებელი კომპანია, დაარსებული 2010 წელს..."
              rows={3}
            />
          </div>

          {/* Full width: Terms + Submit */}
          <div className="terms-container form-group--full">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              ვეთანხმები <Link to="/terms">მომსახურების პირობებს</Link> და{" "}
              <Link to="/privacy">კონფიდენციალურობის პოლიტიკას</Link>
            </label>
          </div>

          <button type="submit" className="create-account-btn form-group--full">
            რეგისტრაცია
          </button>
        </form>

        {/* <div className="sign-in-container">
          <p>
            უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
          </p>
        </div> */}
      </div>

      <div className="back-to-home">
        <Link to="/">
          <img src={arrowLeft} alt="უკან" />
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    </div>
  );
}

export default PartnerRegistration;
