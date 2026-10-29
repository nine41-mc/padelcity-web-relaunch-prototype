import type { Locale } from "../i18n/config";

/**
 * Event inquiry (Contentful: page "eventInquiry" + module "eventInquiryTeaser" on /events) – group and company events
 * from 2 courts × 2 hours, sent as a request instead of booked in the app. Copy from the briefing
 * „eventanfrage-formular_V2“ (29.10.2026). TODO(content): confirm „3 Wochen im Voraus“ for app bookings with Ops.
 */

const de = {
  meta: {
    title: "Event anfragen",
    description: "Firmen-Event, Geburtstag oder Mannschaftsabend: Frag dein Padel-Event ab 2 Courts à 2 Stunden an – wir melden uns mit einem unverbindlichen Angebot.",
  },
  hero: {
    eyebrow: "Events",
    title: "Dein Event",
    accent: "anfragen",
    lead: "Teambuilding on and off the court! Gemeinsam gestalten wir ein unvergessliches Padel-Erlebnis für euer Team, eure Kunden oder eure Freunde.",
    imageAlt: "Volle Halle bei einem PadelCity Event",
  },
  teaser: {
    eyebrow: "Teambuilding",
    title: "Dein Event",
    accent: "bei uns",
    text: "Teambuilding on and off the court! Gemeinsam gestalten wir ein unvergessliches Padel-Erlebnis für euer Team, eure Kunden oder eure Freunde.",
    cta: "Jetzt anfragen",
  },
  facts: {
    title: "Gut zu wissen",
    items: [
      { label: "Vorlauf", value: "4 Wochen", text: "Anfragen über dieses Formular bearbeiten wir mit mindestens 4 Wochen Vorlauf." },
      { label: "Mindestumfang", value: "2 Courts · 2 Std.", text: "Ab 2 Courts à 2 Stunden – privat wie geschäftlich." },
      { label: "Kleinere Buchungen", value: "In der App", text: "Einfach in der PadelCity App buchen. Termine werden dort jeweils 3 Wochen im Voraus freigeschaltet." },
    ],
  },
  intro: {
    title: "Jetzt Formular ausfüllen",
    text: "Dauert keine 2 Minuten – wir melden uns schnellstmöglich mit einem unverbindlichen Angebot bei dir.",
  },
  form: {
    steps: { event: "Dein Event", addons: "Zusatzleistungen", contact: "Deine Kontaktdaten" },
    occasion: {
      label: "Anlass",
      options: [
        { value: "company", title: "Firmen-Event", text: "z. B. Afterwork, Weihnachtsfeier" },
        { value: "private", title: "Privates Event", text: "z. B. (Kinder-)Geburtstag, Mannschaftsabend" },
        { value: "other", title: "Sonstiges", text: "alles andere" },
      ],
    },
    groupSize: { label: "Gruppengröße (Personen)", placeholder: "z. B. 18" },
    location: { label: "Gewünschter Standort", open: "Noch offen / egal" },
    date: {
      label: "Wunschtermin(e)",
      placeholder: "z. B. Fr, 11.12.2026, 18:00–20:00 Uhr – alternativ Do, 10.12.2026",
      hint: "Je konkreter, desto schneller unser Angebot – gerne mit Ausweichtermin.",
    },
    addonsNote: "Ob und in welchem Umfang Zusatzleistungen möglich sind, stimmen wir für jeden Standort individuell ab – abhängig von Kapazität und Möglichkeiten vor Ort.",
    addons: [
      { name: "coach", title: "Coach", text: "Trainer für Einführung oder Training" },
      { name: "tournament", title: "Turnierleitung", text: "Wir organisieren und leiten euer Turnier" },
      { name: "catering", title: "Gastrobedarf", text: "Food & Drinks vor Ort" },
    ],
    yes: "Ja",
    no: "Nein",
    details: {
      label: "Was dürfen wir noch wissen?",
      placeholder: "Wir sind eine Gruppe von 18 Leuten und hätten gerne 4 Courts für je 2 Stunden. 12 Leihschläger sowie Bälle bräuchten wir auch.",
      hint: "z. B. Anzahl Courts & Dauer, Leihschläger, Details zu den Zusatzleistungen",
    },
    firstName: "Vorname",
    lastName: "Name",
    email: "E-Mail-Adresse",
    phone: "Telefonnummer",
    optional: "(optional)",
    submit: "Unverbindlich anfragen",
    errors: {
      summary: "Bitte fülle alle Pflichtfelder (*) korrekt aus.",
      occasion: "Bitte wähle einen Anlass.",
      groupSize: "Bitte gib an, wie viele Personen kommen.",
      location: "Bitte wähle einen Standort.",
      date: "Bitte nenne einen Wunschtermin.",
      firstName: "Bitte gib deinen Vornamen an.",
      lastName: "Bitte gib deinen Namen an.",
      email: "Bitte gib eine gültige E-Mail-Adresse an.",
      consent: "Bitte stimme der Verarbeitung deiner Daten zu.",
    },
    success: { title: "Danke!", text: "Deine Anfrage ist bei uns eingegangen. Wir melden uns in Kürze bei dir." },
  },
};

export type EventInquiryContent = typeof de;

const en: EventInquiryContent = {
  meta: {
    title: "Request an event",
    description: "Company event, birthday or team night: request your padel event from 2 courts for 2 hours – we'll get back to you with a no-obligation offer.",
  },
  hero: {
    eyebrow: "Events",
    title: "Request your",
    accent: "event",
    lead: "Team building on and off the court! Together we'll create an unforgettable padel experience for your team, your clients or your friends.",
    imageAlt: "Packed hall at a PadelCity event",
  },
  teaser: {
    eyebrow: "Team building",
    title: "Your event",
    accent: "with us",
    text: "Team building on and off the court! Together we'll create an unforgettable padel experience for your team, your clients or your friends.",
    cta: "Send a request",
  },
  facts: {
    title: "Good to know",
    items: [
      { label: "Lead time", value: "4 weeks", text: "We handle requests sent via this form with at least 4 weeks' notice." },
      { label: "Minimum size", value: "2 courts · 2 hrs", text: "From 2 courts for 2 hours each – private or business." },
      { label: "Smaller bookings", value: "In the app", text: "Simply book in the PadelCity app. Slots open there 3 weeks in advance." },
    ],
  },
  intro: {
    title: "Fill in the form now",
    text: "Takes less than 2 minutes – we'll get back to you as soon as possible with a no-obligation offer.",
  },
  form: {
    steps: { event: "Your event", addons: "Extras", contact: "Your contact details" },
    occasion: {
      label: "Occasion",
      options: [
        { value: "company", title: "Company event", text: "e.g. afterwork, Christmas party" },
        { value: "private", title: "Private event", text: "e.g. (kids') birthday, team night" },
        { value: "other", title: "Other", text: "anything else" },
      ],
    },
    groupSize: { label: "Group size (people)", placeholder: "e.g. 18" },
    location: { label: "Preferred location", open: "Not decided yet" },
    date: {
      label: "Preferred date(s)",
      placeholder: "e.g. Fri, 11 Dec 2026, 6–8 pm – or Thu, 10 Dec 2026",
      hint: "The more specific, the faster our offer – ideally with an alternative date.",
    },
    addonsNote: "Whether and to what extent extras are possible is agreed individually for each location – depending on capacity and what the club can offer.",
    addons: [
      { name: "coach", title: "Coach", text: "A coach for an introduction or training" },
      { name: "tournament", title: "Tournament management", text: "We organise and run your tournament" },
      { name: "catering", title: "Catering", text: "Food & drinks on site" },
    ],
    yes: "Yes",
    no: "No",
    details: {
      label: "Anything else we should know?",
      placeholder: "We're a group of 18 and would like 4 courts for 2 hours each. We'd also need 12 rental rackets and balls.",
      hint: "e.g. number of courts & duration, rental rackets, details on the extras",
    },
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    phone: "Phone number",
    optional: "(optional)",
    submit: "Send request",
    errors: {
      summary: "Please fill in all required fields (*) correctly.",
      occasion: "Please choose an occasion.",
      groupSize: "Please tell us how many people are coming.",
      location: "Please choose a location.",
      date: "Please name a preferred date.",
      firstName: "Please enter your first name.",
      lastName: "Please enter your last name.",
      email: "Please enter a valid email address.",
      consent: "Please agree to the processing of your data.",
    },
    success: { title: "Thanks!", text: "We've received your request and will get back to you shortly." },
  },
};

const pl: EventInquiryContent = {
  meta: {
    title: "Zapytaj o event",
    description: "Event firmowy, urodziny czy wieczór drużynowy: zapytaj o event padlowy od 2 kortów na 2 godziny – odezwiemy się z niezobowiązującą ofertą.",
  },
  hero: {
    eyebrow: "Eventy",
    title: "Zapytaj o",
    accent: "event",
    lead: "Teambuilding na korcie i poza nim! Razem stworzymy niezapomniane padlowe przeżycie dla twojego zespołu, klientów lub przyjaciół.",
    imageAlt: "Pełna hala podczas eventu PadelCity",
  },
  teaser: {
    eyebrow: "Teambuilding",
    title: "Twój event",
    accent: "u nas",
    text: "Teambuilding na korcie i poza nim! Razem stworzymy niezapomniane padlowe przeżycie dla twojego zespołu, klientów lub przyjaciół.",
    cta: "Wyślij zapytanie",
  },
  facts: {
    title: "Dobrze wiedzieć",
    items: [
      { label: "Wyprzedzenie", value: "4 tygodnie", text: "Zapytania z tego formularza realizujemy z co najmniej 4-tygodniowym wyprzedzeniem." },
      { label: "Minimalny zakres", value: "2 korty · 2 godz.", text: "Od 2 kortów na 2 godziny – prywatnie i firmowo." },
      { label: "Mniejsze rezerwacje", value: "W aplikacji", text: "Po prostu zarezerwuj w aplikacji PadelCity. Terminy są tam udostępniane 3 tygodnie wcześniej." },
    ],
  },
  intro: {
    title: "Wypełnij formularz",
    text: "Zajmie ci to mniej niż 2 minuty – odezwiemy się jak najszybciej z niezobowiązującą ofertą.",
  },
  form: {
    steps: { event: "Twój event", addons: "Usługi dodatkowe", contact: "Twoje dane kontaktowe" },
    occasion: {
      label: "Okazja",
      options: [
        { value: "company", title: "Event firmowy", text: "np. afterwork, impreza świąteczna" },
        { value: "private", title: "Event prywatny", text: "np. urodziny (także dziecięce), wieczór drużynowy" },
        { value: "other", title: "Inne", text: "wszystko inne" },
      ],
    },
    groupSize: { label: "Liczba osób", placeholder: "np. 18" },
    location: { label: "Preferowana lokalizacja", open: "Jeszcze nie wiem" },
    date: {
      label: "Preferowany termin (terminy)",
      placeholder: "np. pt., 11.12.2026, 18:00–20:00 – alternatywnie czw., 10.12.2026",
      hint: "Im konkretniej, tym szybciej przygotujemy ofertę – najlepiej z terminem zapasowym.",
    },
    addonsNote: "Czy i w jakim zakresie usługi dodatkowe są możliwe, ustalamy indywidualnie dla każdej lokalizacji – w zależności od dostępności i możliwości na miejscu.",
    addons: [
      { name: "coach", title: "Trener", text: "Trener na wprowadzenie lub trening" },
      { name: "tournament", title: "Organizacja turnieju", text: "Organizujemy i prowadzimy wasz turniej" },
      { name: "catering", title: "Catering", text: "Jedzenie i napoje na miejscu" },
    ],
    yes: "Tak",
    no: "Nie",
    details: {
      label: "Co jeszcze powinniśmy wiedzieć?",
      placeholder: "Jesteśmy grupą 18 osób i chcielibyśmy 4 korty na 2 godziny każdy. Potrzebujemy też 12 rakiet do wypożyczenia i piłek.",
      hint: "np. liczba kortów i czas, rakiety do wypożyczenia, szczegóły usług dodatkowych",
    },
    firstName: "Imię",
    lastName: "Nazwisko",
    email: "Adres e-mail",
    phone: "Numer telefonu",
    optional: "(opcjonalnie)",
    submit: "Wyślij niezobowiązujące zapytanie",
    errors: {
      summary: "Wypełnij poprawnie wszystkie pola obowiązkowe (*).",
      occasion: "Wybierz okazję.",
      groupSize: "Podaj, ile osób przyjdzie.",
      location: "Wybierz lokalizację.",
      date: "Podaj preferowany termin.",
      firstName: "Podaj swoje imię.",
      lastName: "Podaj swoje nazwisko.",
      email: "Podaj poprawny adres e-mail.",
      consent: "Wyraź zgodę na przetwarzanie danych.",
    },
    success: { title: "Dzięki!", text: "Otrzymaliśmy twoje zapytanie. Wkrótce się odezwiemy." },
  },
};

export const eventInquiryContent: Record<Locale, EventInquiryContent> = { de, en, pl };
