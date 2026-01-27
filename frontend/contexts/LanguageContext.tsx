"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "bg" | "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  bg: {
    // General
    "skipToMain": "Към основното съдържание",

    // Navbar
    "navbar.dashboard": "Dashboard",
    "navbar.tools": "Инструменти",
    "navbar.addTool": "Добави инструмент",
    "navbar.profile": "Профил",
    "navbar.logout": "Изход",
    "navbar.login": "Вход",

    // Home
    "home.title": "AI Tools Platform",
    "home.tools": "Каталог с инструменти",
    "home.login": "Вход",

    // Dashboard
    "dashboard.welcome": "Добре дошъл",
    "dashboard.role": "Роля",
    "dashboard.totalTools": "Общо инструменти",
    "dashboard.myTools": "Мои инструменти",
    "dashboard.views": "Прегледи",
    "dashboard.quickActions": "Бързи действия",
    "dashboard.addNewTool": "Добави нов инструмент",
    "dashboard.browseTools": "Разгледай инструменти",
    "dashboard.myProfile": "Моят профил",
    "dashboard.recentTools": "Последни инструменти",
    "dashboard.viewAll": "Виж всички",

    // Footer
    "footer.copyright": "© 2026 AI Tools Platform. Всички права запазени.",
    "footer.rights": "Всички права запазени",
    "footer.creator": "Alexa Yunakova",
    "footer.quickLinks": "Бързи връзки",
    "footer.tools": "Инструменти",
    "footer.aboutPlatform": "За платформата",
    "footer.contacts": "Контакти",
    "footer.aboutUs": "За нас",
    "footer.aboutProject": "За проекта",
    "footer.futureProjects": "Бъдещи проекти",
    "footer.contact": "Контакт",

    // About Us Page
    "aboutUs.title": "За нас",
    "aboutUs.subtitle": "Запознайте се с създателя на платформата",
    "aboutUs.name": "Александра Юнакова",
    "aboutUs.bio1": "Аз съм Александра Юнакова — специалист по обучение и развитие със силен опит в клиентски операции, обучение и оптимизация на процеси в индустрията на iGaming.",
    "aboutUs.bio2": "През последните няколко години израснах от първа линия клиентска подкрепа до ръководител на екип и по-късно в обучение и развитие. Това пътуване ми помогна да разбера цялата картина — как клиентското изживяване, оперативната ефективност и представянето на екипа са свързани.",
    "aboutUs.bio3": "Специализирам се в създаването на структурирани обучителни програми, подобряването на работните процеси и помагането на екипите да работят по-умно чрез по-добра комуникация, документация и дизайн на процеси. Обичам да превръщам сложността в яснота — трансформирането на бъркани или повтарящи се системи в ефективни, лесни за следване решения, които правят работата на хората по-гладка и клиентите по-щастливи.",
    "aboutUs.bio4": "Академичното ми образование е в българска филология, където също преподавах български език и литература — опит, който засили моите комуникационни умения, прецизност и способност да обяснявам сложни идеи просто.",
    "aboutUs.bio5": "Професионално съм движен от растеж, сътрудничество и значимо въздействие. Най-добре съм в динамични среди, където мога да комбинирам аналитично мислене с креативност, за да подобря как хората учат, комуникират и се представят.",

    // About Project Page
    "aboutProject.title": "За проекта",
    "aboutProject.subtitle": "Нашата мисия",
    "aboutProject.content1": "Платформата AI Tools има за цел да помогне на всеки, от напълно начинаещ или най-обикновен потребител, до програмисти, маркетинг специалисти и специалисти от всякакви индустрии да намират по-лесно най-подходящите AI инструменти.",
    "aboutProject.content2": "Вярваме, че изкуственият интелект трябва да бъде достъпен за всички, независимо от техническото ниво.",
    "aboutProject.content3": "Нашата платформа предоставя курирана колекция от AI инструменти, организирани по категории, за да улесним откриването на перфектното решение за вашите нужди.",

    // Future Projects Page
    "futureProjects.title": "Бъдещи проекти",
    "futureProjects.subtitle": "Какво предстои",
    "futureProjects.content": "Скоро тук ще видите нашите планове за бъдещето на платформата.",

    // Contact Page
    "contact.title": "Свържете се с нас",
    "contact.subtitle": "Имате въпроси? Ще се радваме да чуем от вас",
    "contact.email": "Email",
    "contact.emailAddress": "contact@aitools.com",

    // Auth
    "auth.loginTitle": "Вход в системата",
    "auth.email": "Email",
    "auth.password": "Парола",
    "auth.name": "Име",
    "auth.role": "Роля",
    "auth.login": "Вход",
    "auth.loggingIn": "Влизане...",
    "auth.register": "Регистрация",
    "auth.registering": "Регистриране...",
    "auth.noAccount": "Нямаш акаунт?",
    "auth.hasAccount": "Вече имаш акаунт?",
    "auth.registerLink": "Регистрирай се",
    "auth.loginLink": "Влез",
    "auth.loginSuccess": "Успешно влизане!",
    "auth.loginError": "Грешка при вход",
    "auth.registerSuccess": "Успешна регистрация!",
    "auth.registerError": "Грешка при регистрация",
    "auth.company": "Компания",
    "auth.dateOfBirth": "Дата на раждане",
    "auth.country": "Държава",
    "auth.profession": "Професия",
    "auth.companyPlaceholder": "Вашата компания",
    "auth.dateOfBirthPlaceholder": "Изберете дата",
    "auth.countryPlaceholder": "Вашата държава",
    "auth.professionPlaceholder": "Вашата професия",
    "auth.passwordConfirm": "Потвърди парола",
    "auth.passwordConfirmPlaceholder": "Въведете паролата отново",
    "auth.passwordRequirements": "Изисквания за паролата:",
    "auth.passwordMin": "Минимум 8 символа",
    "auth.passwordMax": "Максимум 12 символа",
    "auth.passwordUppercase": "Поне една главна буква",
    "auth.passwordLowercase": "Поне една малка буква",
    "auth.passwordDigit": "Поне една цифра",
    "auth.passwordNoSpecial": "Без специални символи",

    // Tools
    "tools.search": "Търси инструменти",
    "tools.category": "Категория",
    "tools.allCategories": "Всички категории",
    "tools.visitWebsite": "Посети сайта",
    "tools.noLink": "Няма линк",
    "tools.noToolsYet": "Все още няма инструменти",
    "tools.addFirst": "Добави първия инструмент",
    "tools.viewsCount": "прегледа",
  },
  en: {
    // General
    "skipToMain": "Skip to main content",

    // Navbar
    "navbar.dashboard": "Dashboard",
    "navbar.tools": "Tools",
    "navbar.addTool": "Add Tool",
    "navbar.profile": "Profile",
    "navbar.logout": "Logout",
    "navbar.login": "Login",

    // Home
    "home.title": "AI Tools Platform",
    "home.tools": "Tools Catalog",
    "home.login": "Login",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.role": "Role",
    "dashboard.totalTools": "Total Tools",
    "dashboard.myTools": "My Tools",
    "dashboard.views": "Views",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.addNewTool": "Add New Tool",
    "dashboard.browseTools": "Browse Tools",
    "dashboard.myProfile": "My Profile",
    "dashboard.recentTools": "Recent Tools",
    "dashboard.viewAll": "View All",

    // Footer
    "footer.copyright": "© 2026 AI Tools Platform. All rights reserved.",
    "footer.rights": "All rights reserved",
    "footer.creator": "Alexa Yunakova",
    "footer.quickLinks": "Quick Links",
    "footer.tools": "Tools",
    "footer.aboutPlatform": "About Platform",
    "footer.contacts": "Contacts",
    "footer.aboutUs": "About Us",
    "footer.aboutProject": "About the Project",
    "footer.futureProjects": "Future Projects",
    "footer.contact": "Contact",

    // About Us Page
    "aboutUs.title": "About Us",
    "aboutUs.subtitle": "Meet the creator of the platform",
    "aboutUs.name": "Alexandra Yunakova",
    "aboutUs.bio1": "I'm Alexandra Yunakova — a Learning and Development professional with a strong background in customer operations, training, and process optimization within the iGaming industry.",
    "aboutUs.bio2": "Over the past few years, I've worked my way from front-line customer support to team leadership and later into learning and development. This journey helped me understand the full picture — how customer experience, operational efficiency, and team performance are all connected.",
    "aboutUs.bio3": "I specialize in creating structured training programs, improving workflows, and helping teams work smarter through better communication, documentation, and process design. I enjoy turning complexity into clarity — transforming messy or repetitive systems into efficient, easy-to-follow solutions that make people's work smoother and customers happier.",
    "aboutUs.bio4": "My academic background is in Bulgarian Philology, where I also taught Bulgarian language and literature — an experience that strengthened my communication skills, precision, and ability to explain complex ideas simply.",
    "aboutUs.bio5": "Professionally, I'm driven by growth, collaboration, and meaningful impact. I'm at my best in dynamic environments where I can combine analytical thinking with creativity to improve how people learn, communicate, and perform.",

    // About Project Page
    "aboutProject.title": "About the Project",
    "aboutProject.subtitle": "Our Mission",
    "aboutProject.content1": "The AI Tools platform aims to help everyone, from complete beginners or everyday users, to programmers, marketing specialists, and professionals from all industries to easily find the most suitable AI tools.",
    "aboutProject.content2": "We believe that artificial intelligence should be accessible to everyone, regardless of technical level.",
    "aboutProject.content3": "Our platform provides a curated collection of AI tools, organized by categories, to make it easy to discover the perfect solution for your needs.",

    // Future Projects Page
    "futureProjects.title": "Future Projects",
    "futureProjects.subtitle": "What's Coming Next",
    "futureProjects.content": "Coming soon: Our plans for the future of the platform.",

    // Contact Page
    "contact.title": "Contact Us",
    "contact.subtitle": "Have questions? We'd love to hear from you",
    "contact.email": "Email",
    "contact.emailAddress": "contact@aitools.com",

    // Auth
    "auth.loginTitle": "Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.role": "Role",
    "auth.login": "Login",
    "auth.loggingIn": "Logging in...",
    "auth.register": "Register",
    "auth.registering": "Registering...",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.registerLink": "Sign up",
    "auth.loginLink": "Log in",
    "auth.loginSuccess": "Login successful!",
    "auth.loginError": "Login error",
    "auth.registerSuccess": "Registration successful!",
    "auth.registerError": "Registration error",
    "auth.company": "Company",
    "auth.dateOfBirth": "Date of Birth",
    "auth.country": "Country",
    "auth.profession": "Profession",
    "auth.companyPlaceholder": "Your company",
    "auth.dateOfBirthPlaceholder": "Select date",
    "auth.countryPlaceholder": "Your country",
    "auth.professionPlaceholder": "Your profession",
    "auth.passwordConfirm": "Confirm Password",
    "auth.passwordConfirmPlaceholder": "Re-enter your password",
    "auth.passwordRequirements": "Password requirements:",
    "auth.passwordMin": "Minimum 8 characters",
    "auth.passwordMax": "Maximum 12 characters",
    "auth.passwordUppercase": "At least one uppercase letter",
    "auth.passwordLowercase": "At least one lowercase letter",
    "auth.passwordDigit": "At least one digit",
    "auth.passwordNoSpecial": "No special characters",

    // Tools
    "tools.search": "Search tools",
    "tools.category": "Category",
    "tools.allCategories": "All categories",
    "tools.visitWebsite": "Visit Website",
    "tools.noLink": "No Link",
    "tools.noToolsYet": "No tools yet",
    "tools.addFirst": "Add first tool",
    "tools.viewsCount": "views",
  },
  de: {
    // General
    "skipToMain": "Zum Hauptinhalt springen",

    // Navbar
    "navbar.dashboard": "Dashboard",
    "navbar.tools": "Werkzeuge",
    "navbar.addTool": "Tool hinzufügen",
    "navbar.profile": "Profil",
    "navbar.logout": "Abmelden",
    "navbar.login": "Anmelden",

    // Home
    "home.title": "AI Tools Platform",
    "home.tools": "Werkzeug-Katalog",
    "home.login": "Anmelden",

    // Dashboard
    "dashboard.welcome": "Willkommen",
    "dashboard.role": "Rolle",
    "dashboard.totalTools": "Gesamt Werkzeuge",
    "dashboard.myTools": "Meine Werkzeuge",
    "dashboard.views": "Ansichten",
    "dashboard.quickActions": "Schnellaktionen",
    "dashboard.addNewTool": "Neues Tool hinzufügen",
    "dashboard.browseTools": "Werkzeuge durchsuchen",
    "dashboard.myProfile": "Mein Profil",
    "dashboard.recentTools": "Neueste Werkzeuge",
    "dashboard.viewAll": "Alle anzeigen",

    // Footer
    "footer.copyright": "© 2026 AI Tools Platform. Alle Rechte vorbehalten.",
    "footer.rights": "Alle Rechte vorbehalten",
    "footer.creator": "Alexa Yunakova",
    "footer.quickLinks": "Schnellzugriff",
    "footer.tools": "Werkzeuge",
    "footer.aboutPlatform": "Über die Plattform",
    "footer.contacts": "Kontakte",
    "footer.aboutUs": "Über uns",
    "footer.aboutProject": "Über das Projekt",
    "footer.futureProjects": "Zukünftige Projekte",
    "footer.contact": "Kontakt",

    // About Us Page
    "aboutUs.title": "Über uns",
    "aboutUs.subtitle": "Lernen Sie den Schöpfer der Plattform kennen",
    "aboutUs.name": "Alexandra Yunakova",
    "aboutUs.bio1": "Ich bin Alexandra Yunakova — eine Fachkraft für Lernen und Entwicklung mit einem starken Hintergrund in Kundenoperationen, Schulungen und Prozessoptimierung in der iGaming-Branche.",
    "aboutUs.bio2": "In den letzten Jahren habe ich mich von der Kundenbetreuung in erster Linie zur Teamleitung und später in die Lern- und Entwicklungsabteilung hochgearbeitet. Diese Reise half mir, das Gesamtbild zu verstehen — wie Kundenerfahrung, operative Effizienz und Teamleistung miteinander verbunden sind.",
    "aboutUs.bio3": "Ich bin spezialisiert auf die Erstellung strukturierter Schulungsprogramme, die Verbesserung von Arbeitsabläufen und die Unterstützung von Teams, intelligenter zu arbeiten durch bessere Kommunikation, Dokumentation und Prozessgestaltung. Ich genieße es, Komplexität in Klarheit zu verwandeln — chaotische oder sich wiederholende Systeme in effiziente, leicht verständliche Lösungen umzuwandeln, die die Arbeit der Menschen reibungsloser und Kunden zufriedener machen.",
    "aboutUs.bio4": "Mein akademischer Hintergrund liegt in der bulgarischen Philologie, wo ich auch bulgarische Sprache und Literatur unterrichtete — eine Erfahrung, die meine Kommunikationsfähigkeiten, Präzision und Fähigkeit, komplexe Ideen einfach zu erklären, gestärkt hat.",
    "aboutUs.bio5": "Beruflich bin ich von Wachstum, Zusammenarbeit und bedeutungsvoller Wirkung angetrieben. Ich bin am besten in dynamischen Umgebungen, in denen ich analytisches Denken mit Kreativität kombinieren kann, um zu verbessern, wie Menschen lernen, kommunizieren und leisten.",

    // About Project Page
    "aboutProject.title": "Über das Projekt",
    "aboutProject.subtitle": "Unsere Mission",
    "aboutProject.content1": "Die AI Tools-Plattform zielt darauf ab, jedem zu helfen, von völligen Anfängern oder alltäglichen Benutzern bis hin zu Programmierern, Marketingspezialisten und Fachleuten aus allen Branchen, die am besten geeigneten KI-Tools einfach zu finden.",
    "aboutProject.content2": "Wir glauben, dass künstliche Intelligenz für alle zugänglich sein sollte, unabhängig vom technischen Niveau.",
    "aboutProject.content3": "Unsere Plattform bietet eine kuratierte Sammlung von KI-Tools, die nach Kategorien organisiert sind, um es einfach zu machen, die perfekte Lösung für Ihre Bedürfnisse zu entdecken.",

    // Future Projects Page
    "futureProjects.title": "Zukünftige Projekte",
    "futureProjects.subtitle": "Was kommt als Nächstes",
    "futureProjects.content": "Demnächst: Unsere Pläne für die Zukunft der Plattform.",

    // Contact Page
    "contact.title": "Kontaktieren Sie uns",
    "contact.subtitle": "Haben Sie Fragen? Wir würden uns freuen, von Ihnen zu hören",
    "contact.email": "E-Mail",
    "contact.emailAddress": "contact@aitools.com",

    // Auth
    "auth.loginTitle": "Anmelden",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.name": "Name",
    "auth.role": "Rolle",
    "auth.login": "Anmelden",
    "auth.loggingIn": "Anmelden...",
    "auth.register": "Registrieren",
    "auth.registering": "Registrierung...",
    "auth.noAccount": "Kein Konto?",
    "auth.hasAccount": "Bereits ein Konto?",
    "auth.registerLink": "Registrieren",
    "auth.loginLink": "Anmelden",
    "auth.loginSuccess": "Anmeldung erfolgreich!",
    "auth.loginError": "Anmeldefehler",
    "auth.registerSuccess": "Registrierung erfolgreich!",
    "auth.registerError": "Registrierungsfehler",
    "auth.company": "Firma",
    "auth.dateOfBirth": "Geburtsdatum",
    "auth.country": "Land",
    "auth.profession": "Beruf",
    "auth.companyPlaceholder": "Ihre Firma",
    "auth.dateOfBirthPlaceholder": "Datum wählen",
    "auth.countryPlaceholder": "Ihr Land",
    "auth.professionPlaceholder": "Ihr Beruf",
    "auth.passwordConfirm": "Passwort bestätigen",
    "auth.passwordConfirmPlaceholder": "Passwort erneut eingeben",
    "auth.passwordRequirements": "Passwortanforderungen:",
    "auth.passwordMin": "Mindestens 8 Zeichen",
    "auth.passwordMax": "Maximal 12 Zeichen",
    "auth.passwordUppercase": "Mindestens ein Großbuchstabe",
    "auth.passwordLowercase": "Mindestens ein Kleinbuchstabe",
    "auth.passwordDigit": "Mindestens eine Ziffer",
    "auth.passwordNoSpecial": "Keine Sonderzeichen",

    // Tools
    "tools.search": "Werkzeuge suchen",
    "tools.category": "Kategorie",
    "tools.allCategories": "Alle Kategorien",
    "tools.visitWebsite": "Website besuchen",
    "tools.noLink": "Kein Link",
    "tools.noToolsYet": "Noch keine Werkzeuge",
    "tools.addFirst": "Erstes Tool hinzufügen",
    "tools.viewsCount": "Ansichten",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;

    if (!savedLang || !["bg", "en", "de"].includes(savedLang)) {
      setLanguageState("en");
      localStorage.setItem("language", "en");
    } else {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
