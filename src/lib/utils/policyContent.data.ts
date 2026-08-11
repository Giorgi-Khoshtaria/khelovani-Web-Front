export type PolicyCategory = "buyer" | "partner" | "privacy";

interface Bilingual {
  ge: string;
  en: string;
}

interface BilingualList {
  ge: string[];
  en: string[];
}

export interface PolicySection {
  id: string;
  title: Bilingual;
  body: BilingualList;
}

export interface PolicyDocument {
  shortVersion: Bilingual;
  sections: PolicySection[];
}

// Placeholder legal copy — swap the ge/en strings below for the real text.
export const POLICY_CONTENT: Record<PolicyCategory, PolicyDocument> = {
  buyer: {
    shortVersion: {
      en: "Khelovani is the shopfront, the maker is the seller. You have 14 days to return a stock item, made-to-order work is final unless it arrives faulty, and makers keep most of what you pay. Everything below is the same thing said carefully.",
      ge: "Khelovani არის ვიტრინა, ხოლო გამყიდველი — ხელოსანია. მარაგში არსებული ნივთის დაბრუნება შესაძლებელია 14 დღის განმავლობაში, ხოლო შეკვეთით დამზადებული ნივთი საბოლოოა, თუ არ მოვიდა წუნდებული. ქვემოთ იგივეა, უფრო დეტალურად.",
    },
    sections: [
      {
        id: "who-we-are",
        title: { en: "Who we are", ge: "ვინ ვართ ჩვენ" },
        body: {
          en: [
            "Khelovani LLC is registered in Tbilisi, Georgia, and operates this marketplace. We provide the storefront, take payment and arrange delivery. The contract of sale for any piece is between you and the maker who listed it — we act as their commercial agent, not as the seller.",
            "By placing an order or opening an account you accept these terms. If you are ordering on behalf of a company, you confirm you are allowed to do so.",
          ],
          ge: [
            "Khelovani LLC რეგისტრირებულია თბილისში, საქართველოში, და მართავს ამ პლატფორმას. ჩვენ ვთავაზობთ ვიტრინას, ვიღებთ გადახდას და ვაწყობთ მიწოდებას. ნასყიდობის ხელშეკრულება ყოველ ნივთზე იდება თქვენსა და ხელოსანს შორის — ჩვენ ვმოქმედებთ, როგორც მისი კომერციული აგენტი და არა როგორც გამყიდველი.",
            "შეკვეთის განთავსებით ან ანგარიშის გახსნით თქვენ ეთანხმებით ამ პირობებს. თუ შეკვეთას აფორმებთ კომპანიის სახელით, თქვენ ადასტურებთ, რომ გაქვთ ამის უფლება.",
          ],
        },
      },
      {
        id: "your-account",
        title: { en: "Your account", ge: "თქვენი ანგარიში" },
        body: {
          en: [
            "You need an account to order. Keep your details accurate and your password to yourself — you're responsible for activity under your login unless you tell us it's been compromised.",
          ],
          ge: [
            "შეკვეთისთვის საჭიროა ანგარიში. შეინახეთ თქვენი მონაცემები ზუსტი და პაროლი პირადი — თქვენ ხართ პასუხისმგებელი ანგარიშზე განხორციელებულ ქმედებებზე, სანამ არ შეგვატყობინებთ მისი გატეხვის შესახებ.",
          ],
        },
      },
      {
        id: "orders-and-prices",
        title: { en: "Orders and prices", ge: "შეკვეთები და ფასები" },
        body: {
          en: [
            "Prices are shown in GEL and include any tax the maker is required to charge. An order is confirmed once payment is captured, not when you add an item to your cart — prices and stock can change until then.",
          ],
          ge: [
            "ფასები მითითებულია ლარში და მოიცავს ყველა გადასახადს, რომლის დარიცხვაც ხელოსანს ევალება. შეკვეთა დადასტურებულად ითვლება გადახდის ჩარიცხვის შემდეგ და არა კალათაში დამატებისას — მანამდე ფასი და მარაგი შეიძლება შეიცვალოს.",
          ],
        },
      },
      {
        id: "delivery",
        title: { en: "Delivery", ge: "მიწოდება" },
        body: {
          en: [
            "Each listing shows its own dispatch window, since it's set by the individual maker. You'll get a tracking link once your order ships. If a delivery is significantly late, contact us and we'll chase it with the maker or courier on your behalf.",
          ],
          ge: [
            "თითოეულ განცხადებას აქვს გაგზავნის ინდივიდუალური ვადა, რომელსაც ხელოსანი ადგენს. შეკვეთის გაგზავნისთანავე მიიღებთ თვალთვალის ბმულს. თუ მიწოდება მნიშვნელოვნად ჩამორჩება, დაგვიკავშირდით — ჩვენ დავუკავშირდებით ხელოსანს ან საკურიერო სამსახურს თქვენს სახელით.",
          ],
        },
      },
      {
        id: "returns-and-cancellation",
        title: { en: "Returns and cancellation", ge: "დაბრუნება და გაუქმება" },
        body: {
          en: [
            "You can return a stock item within 14 days of delivery, unused and in its original packaging, for a full refund. Made-to-order or personalised pieces can't be returned unless they arrive damaged, faulty, or different from what was listed.",
          ],
          ge: [
            "მარაგში არსებული ნივთის დაბრუნება შესაძლებელია მიწოდებიდან 14 დღის განმავლობაში, გამოუყენებელი და საწყის შეფუთვაში, სრული ანაზღაურებით. შეკვეთით დამზადებული ან პერსონალიზებული ნივთის დაბრუნება შესაძლებელია მხოლოდ იმ შემთხვევაში, თუ ის მოვიდა დაზიანებული, წუნდებული ან განცხადებისგან განსხვავებული.",
          ],
        },
      },
      {
        id: "our-responsibility",
        title: { en: "Our responsibility", ge: "ჩვენი პასუხისმგებლობა" },
        body: {
          en: [
            "We check every maker before they can sell, but we don't manufacture or inspect each piece — the maker is responsible for the accuracy of their listing and the quality of what they send. We'll step in and mediate if something goes wrong with an order.",
            "Nothing here limits liability for death, personal injury or fraud, or any liability that cannot be limited under Georgian law.",
          ],
          ge: [
            "ჩვენ ვამოწმებთ ყველა ხელოსანს გაყიდვის დაწყებამდე, თუმცა არ ვამზადებთ და არც ვამოწმებთ თითოეულ ნივთს — განცხადების სიზუსტესა და გამოგზავნილი ნივთის ხარისხზე პასუხისმგებელია ხელოსანი. თუ შეკვეთასთან დაკავშირებით რამე არასწორად წავიდა, ჩვენ ჩავერევით და დავეხმარებით დავის მოგვარებაში.",
            "წინამდებარე პირობებში არაფერი ზღუდავს პასუხისმგებლობას სიცოცხლის მოსპობის, ჯანმრთელობის დაზიანების ან თაღლითობისთვის, ან ნებისმიერი პასუხისმგებლობისთვის, რომლის შეზღუდვაც საქართველოს კანონმდებლობით დაუშვებელია.",
          ],
        },
      },
      {
        id: "law-and-disputes",
        title: { en: "Law and disputes", ge: "სამართალი და დავები" },
        body: {
          en: [
            "These terms are governed by Georgian law and the courts of Tbilisi have jurisdiction. Before going to court, write to us at hello@khelovani.ge — we answer disputes within 14 days and settle most of them there.",
          ],
          ge: [
            "წინამდებარე პირობები რეგულირდება საქართველოს კანონმდებლობით და დავების განხილვა ექვემდებარება თბილისის სასამართლოს იურისდიქციას. სასამართლოში მიმართვამდე მოგვწერეთ hello@khelovani.ge-ზე — ჩვენ ვპასუხობთ დავებს 14 დღის განმავლობაში და უმეტესობას სწორედ ასე ვაგვარებთ.",
          ],
        },
      },
      {
        id: "changes-to-these-terms",
        title: { en: "Changes to these terms", ge: "ცვლილებები პირობებში" },
        body: {
          en: [
            "We give 30 days' notice by email before any material change, and keep previous versions available on request. Orders already placed are governed by the terms in force when you placed them.",
          ],
          ge: [
            "ნებისმიერი მნიშვნელოვანი ცვლილების შესახებ გაცნობებთ ელფოსტით 30 დღით ადრე და მოთხოვნის შემთხვევაში შევინახავთ წინა ვერსიებს. უკვე განთავსებულ შეკვეთებზე მოქმედებს ის პირობები, რომლებიც შეკვეთის გაფორმების დროს იყო ძალაში.",
          ],
        },
      },
    ],
  },

  partner: {
    shortVersion: {
      en: "You keep 88% of every sale, dispatch within the window you set, and only list work you made or genuinely sourced yourself. Break the listing or fulfilment rules and we'll pause your shop while we sort it out — the details below explain how and why.",
      ge: "თქვენ იტოვებთ ყოველი გაყიდვის 88%-ს, აგზავნით ნივთს თქვენ მიერვე დაწესებულ ვადაში და ათავსებთ მხოლოდ იმ ნამუშევრებს, რომლებიც თავად დაამზადეთ ან პირადად შეიძინეთ. წესების დარღვევის შემთხვევაში დროებით შევაჩერებთ თქვენს მაღაზიას, სანამ საკითხს არ მოვაგვარებთ.",
    },
    sections: [
      {
        id: "becoming-a-partner",
        title: { en: "Becoming a partner", ge: "პარტნიორად გახდომა" },
        body: {
          en: [
            "We approve partners individually. You'll need to show us examples of your work and confirm you make it yourself, or a small team you run makes it. We can decline or later remove an application without giving a commercial reason.",
          ],
          ge: [
            "პარტნიორებს ვამტკიცებთ ინდივიდუალურად. დაგჭირდებათ თქვენი ნამუშევრების ნიმუშების წარმოდგენა და დადასტურება, რომ ნივთებს თავად ან თქვენს ხელმძღვანელობით მომუშავე მცირე გუნდი ამზადებს. ჩვენ შეგვიძლია განაცხადი უარვყოთ ან მოგვიანებით გავაუქმოთ, კომერციული მიზეზის ახსნის გარეშე.",
          ],
        },
      },
      {
        id: "your-shop",
        title: { en: "Your shop", ge: "თქვენი მაღაზია" },
        body: {
          en: [
            "Listings need real photos of the actual piece, an honest description of materials and dimensions, and accurate stock counts. Misleading listings get taken down; repeated ones can end the partnership.",
          ],
          ge: [
            "განცხადება უნდა შეიცავდეს ნივთის რეალურ ფოტოებს, მასალებისა და ზომების ზუსტ აღწერას და მარაგის სწორ რაოდენობას. შეცდომაში შემყვანი განცხადებები მოიხსნება, ხოლო განმეორებადი შემთხვევები პარტნიორობის შეწყვეტას გამოიწვევს.",
          ],
        },
      },
      {
        id: "commission-and-payouts",
        title: { en: "Commission and payouts", ge: "საკომისიო და გადახდები" },
        body: {
          en: [
            "Khelovani takes a 12% commission on the sale price; you keep 88%. Payouts run every two weeks to the bank account on your partner profile, for orders that passed their return window.",
          ],
          ge: [
            "Khelovani იღებს გასაყიდი ფასის 12%-ს, თქვენ იტოვებთ 88%-ს. გადახდები ხორციელდება ორ კვირაში ერთხელ თქვენს პარტნიორის პროფილში მითითებულ საბანკო ანგარიშზე, იმ შეკვეთებზე, რომელთა დაბრუნების ვადაც ამოწურულია.",
          ],
        },
      },
      {
        id: "fulfilling-orders",
        title: { en: "Fulfilling orders", ge: "შეკვეთების შესრულება" },
        body: {
          en: [
            "State a realistic dispatch window on each listing and hit it. Pack pieces so they survive Georgian courier handling — breakage caused by weak packaging is charged back to the maker, not the buyer.",
          ],
          ge: [
            "თითოეულ განცხადებაზე მიუთითეთ რეალისტური გაგზავნის ვადა და დაიცავით იგი. შეფუთეთ ნივთები ისე, რომ გაუძლონ ტრანსპორტირებას — სუსტი შეფუთვით გამოწვეული დაზიანება ანაზღაურდება ხელოსნის, და არა მყიდველის, ხარჯზე.",
          ],
        },
      },
      {
        id: "what-you-may-not-list",
        title: { en: "What you may not list", ge: "რისი განთავსება არ შეიძლება" },
        body: {
          en: [
            "No mass-manufactured goods resold as handmade, no counterfeit or trademark-infringing items, no hazardous materials, and no work you didn't make or personally source. If you're not sure a piece qualifies, ask us before listing it.",
          ],
          ge: [
            "დაუშვებელია ქარხნული წარმოების საქონლის ხელნაკეთად წარმოჩენა, ყალბი ან სავაჭრო ნიშნის უფლების დამრღვევი ნივთები, საშიში მასალები და ისეთი ნამუშევრები, რომლებიც არ დაგიმზადებიათ ან პირადად არ შეგისყიდიათ. თუ არ ხართ დარწმუნებული, შეესაბამება თუ არა ნივთი წესებს, დაგვიკავშირდით განთავსებამდე.",
          ],
        },
      },
      {
        id: "quality-and-authenticity",
        title: { en: "Quality and authenticity", ge: "ხარისხი და ავთენტურობა" },
        body: {
          en: [
            "We spot-check listings and can ask for proof of origin at any time — a photo of work in progress, materials sourcing, or a studio visit. This protects every maker on Khelovani, including you.",
          ],
          ge: [
            "ჩვენ პერიოდულად ვამოწმებთ განცხადებებს და ნებისმიერ დროს შეგვიძლია მოვითხოვოთ წარმოშობის დამადასტურებელი მასალა — დამზადების პროცესის ფოტო, მასალის წარმომავლობა ან სახელოსნოს მონახულება. ეს იცავს Khelovani-ს ყველა ხელოსანს, თქვენ ჩათვლით.",
          ],
        },
      },
      {
        id: "suspension-and-removal",
        title: { en: "Suspension and removal", ge: "შეჩერება და გაუქმება" },
        body: {
          en: [
            "We can suspend a shop while we investigate a complaint, and remove it for repeated or serious breaches — counterfeit goods, non-delivery, or abuse of buyers. You can appeal any decision by writing to partners@khelovani.ge.",
          ],
          ge: [
            "ჩვენ შეგვიძლია დროებით შევაჩეროთ მაღაზია საჩივრის განხილვის პერიოდში და საბოლოოდ გავაუქმოთ განმეორებადი ან სერიოზული დარღვევის შემთხვევაში — ყალბი საქონელი, მიწოდების არშესრულება ან მყიდველების მიმართ ბოროტად გამოყენება. ნებისმიერი გადაწყვეტილების გასაჩივრება შესაძლებელია partners@khelovani.ge-ზე მიწერით.",
          ],
        },
      },
      {
        id: "law-and-disputes-partner",
        title: { en: "Law and disputes", ge: "სამართალი და დავები" },
        body: {
          en: [
            "As with buyers, these terms are governed by Georgian law and the courts of Tbilisi. We'll always try to resolve a disagreement directly with you before either side considers legal action.",
          ],
          ge: [
            "მყიდველების პირობების მსგავსად, წინამდებარე პირობებიც რეგულირდება საქართველოს კანონმდებლობით და თბილისის სასამართლოს იურისდიქციით. ჩვენ ყოველთვის ვცდილობთ უთანხმოების პირდაპირ მოგვარებას თქვენთან, სანამ რომელიმე მხარე იურიდიულ ნაბიჯებზე იფიქრებს.",
          ],
        },
      },
    ],
  },

  privacy: {
    shortVersion: {
      en: "We collect what's needed to run your order — name, address, a payment reference — and share only what a maker or courier needs to fulfil it. We don't sell your data to anyone. You can ask to see, correct or delete it at any time.",
      ge: "ჩვენ ვაგროვებთ მხოლოდ იმას, რაც საჭიროა თქვენი შეკვეთის შესასრულებლად — სახელი, მისამართი, გადახდის მინიშნება — და ვუზიარებთ მხოლოდ იმას, რაც ხელოსანს ან საკურიერო სამსახურს სჭირდება. თქვენს მონაცემებს არავის ვყიდით. ნებისმიერ დროს შეგიძლიათ მოითხოვოთ მათი ნახვა, შესწორება ან წაშლა.",
    },
    sections: [
      {
        id: "what-we-collect",
        title: { en: "What we collect", ge: "რას ვაგროვებთ" },
        body: {
          en: [
            "Account details you give us — name, email, phone, delivery addresses — plus order history, and basic device and usage data (browser, pages visited) collected through cookies. We don't collect card numbers; those go straight to our payment processor.",
          ],
          ge: [
            "თქვენ მიერ მოწოდებულ ანგარიშის მონაცემებს — სახელი, ელფოსტა, ტელეფონი, მიწოდების მისამართები — ასევე შეკვეთების ისტორიას და მოწყობილობისა და გამოყენების ძირითად მონაცემებს (ბრაუზერი, მონახულებული გვერდები), რომლებსაც ვაგროვებთ ქუქიების საშუალებით. ბარათის ნომრებს არ ვინახავთ — ისინი პირდაპირ გადახდის სისტემას მიემართება.",
          ],
        },
      },
      {
        id: "how-we-use-your-data",
        title: { en: "How we use your data", ge: "როგორ ვიყენებთ თქვენს მონაცემებს" },
        body: {
          en: [
            "To process and deliver orders, run your account, respond to support requests, and improve the marketplace. We'll only send marketing email if you opt in, and you can turn it off at any time from your profile.",
          ],
          ge: [
            "შეკვეთების დასამუშავებლად და მისაწოდებლად, ანგარიშის სამართავად, მხარდაჭერის მოთხოვნებზე საპასუხოდ და პლატფორმის გასაუმჯობესებლად. სარეკლამო წერილებს გამოგიგზავნით მხოლოდ თანხმობის შემთხვევაში და ნებისმიერ დროს შეგიძლიათ გამორთვა პროფილიდან.",
          ],
        },
      },
      {
        id: "cookies-and-tracking",
        title: { en: "Cookies and tracking", ge: "ქუქიები და თვალთვალი" },
        body: {
          en: [
            "Essential cookies keep you logged in and your cart working — those can't be switched off. Analytics cookies help us see what's useful on the site; you can decline these from the cookie banner without losing any functionality.",
          ],
          ge: [
            "აუცილებელი ქუქიები ინახავს თქვენს სესიას და კალათას — მათი გამორთვა შეუძლებელია. ანალიტიკური ქუქიები გვეხმარება გავიგოთ, რა არის საიტზე სასარგებლო — მათი უარყოფა შესაძლებელია ქუქიების ბანერიდან, ფუნქციონალის დაკარგვის გარეშე.",
          ],
        },
      },
      {
        id: "data-sharing",
        title: { en: "Sharing with partners and processors", ge: "გაზიარება პარტნიორებთან და პროვაიდერებთან" },
        body: {
          en: [
            "We share your name, address and order contents with the maker fulfilling your order, and payment details with our payment processor. Couriers get the delivery address and your phone number. None of them may use your data for their own marketing.",
          ],
          ge: [
            "თქვენს სახელს, მისამართს და შეკვეთის შემადგენლობას ვუზიარებთ ხელოსანს, რომელიც ასრულებს შეკვეთას, ხოლო გადახდის მონაცემებს — გადახდის პროვაიდერს. საკურიერო სამსახურს გადაეცემა მიწოდების მისამართი და ტელეფონის ნომერი. მათგან არცერთს არ აქვს უფლება, ეს მონაცემები საკუთარი მარკეტინგისთვის გამოიყენოს.",
          ],
        },
      },
      {
        id: "data-retention",
        title: { en: "Data retention", ge: "მონაცემთა შენახვის ვადა" },
        body: {
          en: [
            "We keep account data while your account is active, and order records for as long as Georgian tax and commercial law requires afterwards. Ask us to close your account and we'll delete what we're not legally required to keep.",
          ],
          ge: [
            "ანგარიშის მონაცემებს ვინახავთ ანგარიშის აქტიურობის პერიოდში, ხოლო შეკვეთის ჩანაწერებს — იმ ვადით, რასაც საქართველოს საგადასახადო და კომერციული კანონმდებლობა მოითხოვს. ანგარიშის დახურვის მოთხოვნისას წავშლით ყველაფერს, რისი შენახვაც კანონით არ არის სავალდებულო.",
          ],
        },
      },
      {
        id: "your-rights",
        title: { en: "Your rights", ge: "თქვენი უფლებები" },
        body: {
          en: [
            "You can ask to see a copy of your data, correct it, delete it, or move it elsewhere, by writing to privacy@khelovani.ge. We'll respond within 30 days, and won't charge for a reasonable request.",
          ],
          ge: [
            "შეგიძლიათ მოითხოვოთ თქვენი მონაცემების ასლი, შესწორება, წაშლა ან სხვაგან გადატანა, წერილის გაგზავნით privacy@khelovani.ge-ზე. ჩვენ ვუპასუხებთ 30 დღის განმავლობაში და გონივრულ მოთხოვნას უფასოდ დავაკმაყოფილებთ.",
          ],
        },
      },
      {
        id: "security",
        title: { en: "Security", ge: "უსაფრთხოება" },
        body: {
          en: [
            "Data is encrypted in transit and access to it is limited to staff who need it to do their job. If a breach ever puts your data at risk, we'll notify you and the relevant authority without undue delay.",
          ],
          ge: [
            "მონაცემები დაშიფრულია გადაცემისას, ხოლო წვდომა შეზღუდულია მხოლოდ იმ თანამშრომლებზე, ვისაც ეს სამუშაოსთვის სჭირდება. თუ რაიმე ინციდენტი საფრთხეს შეუქმნის თქვენს მონაცემებს, დაუყოვნებლივ შეგატყობინებთ თქვენ და შესაბამის ორგანოს.",
          ],
        },
      },
      {
        id: "changes-to-this-policy",
        title: { en: "Changes to this policy", ge: "ცვლილებები პოლიტიკაში" },
        body: {
          en: [
            "If we make a material change to how we handle your data, we'll notify you by email before it takes effect rather than just updating the date at the top of this page.",
          ],
          ge: [
            "თუ თქვენი მონაცემების დამუშავების წესში მნიშვნელოვან ცვლილებას შევიტანთ, გაცნობებთ ელფოსტით ცვლილების ძალაში შესვლამდე და არა მხოლოდ გვერდის თარიღის განახლებით.",
          ],
        },
      },
    ],
  },
};
