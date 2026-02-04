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
    "footer.creator": "Alexa Yunakova & Claude",
    "footer.description": "Открийте и споделете най-добрите AI инструменти за вашите проекти",
    "footer.quickLinks": "Бързи връзки",
    "footer.aboutPlatform": "За платформата",
    "footer.aboutUs": "За нас",
    "footer.aboutPlatformLink": "За платформата",
    "footer.futureProjects": "Бъдещи проекти",
    "footer.contact": "Контакти",

    // About Pages
    "page.aboutUs.title": "За нас",
    "page.aboutUs.subtitle": "Запознайте се със създателя на платформата",
    "page.aboutUs.creatorName": "Александра Юнакова",
    "page.aboutUs.creatorRole": "Learning & Development Professional",
    "page.aboutUs.bio1": "Аз съм Александра Юнакова — професионалист в областта на обучението и развитието с богат опит в клиентските операции, обучения и оптимизация на процеси в iGaming индустрията.",
    "page.aboutUs.bio2": "През последните години преминах от директна клиентска поддръжка към ръководство на екип и по-късно към обучение и развитие. Този път ми помогна да разбера цялостната картина — как клиентското изживяване, оперативната ефективност и представянето на екипа са свързани.",
    "page.aboutUs.bio3": "Специализирам в създаването на структурирани програми за обучение, подобряване на работните процеси и подпомагане на екипите да работят по-умно чрез по-добра комуникация, документация и проектиране на процеси. Обичам да превръщам сложността в яснота — трансформирайки объркани или повтарящи се системи в ефективни, лесни за следване решения.",
    "page.aboutUs.bio4": "Академичният ми бекграунд е в Българска филология, където също преподавах български език и литература — опит, който укрепи комуникационните ми умения и способността да обяснявам сложни идеи просто.",
    "page.aboutUs.bio5": "Професионално съм мотивирана от растеж, сътрудничество и значимо въздействие. Най-добре се представям в динамични среди, където мога да съчетая аналитично мислене с креативност.",

    "page.aboutPlatform.title": "За платформата",
    "page.aboutPlatform.subtitle": "Нашата мисия",
    "page.aboutPlatform.content": "AI Tools Platform има за цел да помогне на всеки — от напълно начинаещ или обикновен потребител до програмисти, маркетинг специалисти и професионалисти от всякакви индустрии — да намират по-лесно най-подходящите AI инструменти за техните нужди. Вярваме, че достъпът до правилните инструменти може да трансформира начина, по който работим и творим.",

    "page.futureProjects.title": "Бъдещи проекти",
    "page.futureProjects.subtitle": "Какво предстои",
    "page.futureProjects.intro": "Работим непрекъснато за подобряване на платформата. Ето какво планираме:",
    "page.futureProjects.item1": "AI-базирани препоръки за инструменти според вашите нужди",
    "page.futureProjects.item2": "Интеграция с популярни работни инструменти (Slack, Teams)",
    "page.futureProjects.item3": "Мобилно приложение за iOS и Android",
    "page.futureProjects.item4": "Разширена система за сравнение на инструменти",
    "page.futureProjects.item5": "Общност и форум за споделяне на опит",

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
    "auth.registerSubtitle": "Създайте нов акаунт в AI Tools Platform",
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
    "footer.creator": "Alexa Yunakova & Claude",
    "footer.description": "Discover and share the best AI tools for your projects",
    "footer.quickLinks": "Quick Links",
    "footer.aboutPlatform": "About Platform",
    "footer.aboutUs": "About Us",
    "footer.aboutPlatformLink": "About the Platform",
    "footer.futureProjects": "Future Projects",
    "footer.contact": "Contact",

    // About Pages
    "page.aboutUs.title": "About Us",
    "page.aboutUs.subtitle": "Meet the creator of the platform",
    "page.aboutUs.creatorName": "Alexandra Yunakova",
    "page.aboutUs.creatorRole": "Learning & Development Professional",
    "page.aboutUs.bio1": "I'm Alexandra Yunakova — a Learning and Development professional with a strong background in customer operations, training, and process optimization within the iGaming industry.",
    "page.aboutUs.bio2": "Over the past few years, I've worked my way from front-line customer support to team leadership and later into learning and development. This journey helped me understand the full picture — how customer experience, operational efficiency, and team performance are all connected.",
    "page.aboutUs.bio3": "I specialize in creating structured training programs, improving workflows, and helping teams work smarter through better communication, documentation, and process design. I enjoy turning complexity into clarity — transforming messy or repetitive systems into efficient, easy-to-follow solutions.",
    "page.aboutUs.bio4": "My academic background is in Bulgarian Philology, where I also taught Bulgarian language and literature — an experience that strengthened my communication skills, precision, and ability to explain complex ideas simply.",
    "page.aboutUs.bio5": "Professionally, I'm driven by growth, collaboration, and meaningful impact. I'm at my best in dynamic environments where I can combine analytical thinking with creativity.",

    "page.aboutPlatform.title": "About the Platform",
    "page.aboutPlatform.subtitle": "Our Mission",
    "page.aboutPlatform.content": "AI Tools Platform aims to help everyone — from complete beginners to programmers, marketing specialists, and professionals from all industries — to more easily find the most suitable AI tools for their needs. We believe that access to the right tools can transform the way we work and create.",

    "page.futureProjects.title": "Future Projects",
    "page.futureProjects.subtitle": "What's Coming",
    "page.futureProjects.intro": "We are continuously working to improve the platform. Here's what we're planning:",
    "page.futureProjects.item1": "AI-powered tool recommendations based on your needs",
    "page.futureProjects.item2": "Integration with popular work tools (Slack, Teams)",
    "page.futureProjects.item3": "Mobile app for iOS and Android",
    "page.futureProjects.item4": "Extended tool comparison system",
    "page.futureProjects.item5": "Community and forum for sharing experiences",

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
    "auth.registerSubtitle": "Create new account in AI Tools Platform",
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
    "footer.creator": "Alexa Yunakova & Claude",
    "footer.description": "Entdecken und teilen Sie die besten KI-Tools für Ihre Projekte",
    "footer.quickLinks": "Schnellzugriff",
    "footer.aboutPlatform": "Über die Plattform",
    "footer.aboutUs": "Über uns",
    "footer.aboutPlatformLink": "Über die Plattform",
    "footer.futureProjects": "Zukünftige Projekte",
    "footer.contact": "Kontakt",

    // About Pages
    "page.aboutUs.title": "Über uns",
    "page.aboutUs.subtitle": "Lernen Sie die Erstellerin der Plattform kennen",
    "page.aboutUs.creatorName": "Alexandra Yunakova",
    "page.aboutUs.creatorRole": "Learning & Development Professional",
    "page.aboutUs.bio1": "Ich bin Alexandra Yunakova — eine Fachfrau für Lernen und Entwicklung mit fundiertem Hintergrund in Kundenoperationen, Schulungen und Prozessoptimierung in der iGaming-Branche.",
    "page.aboutUs.bio2": "In den letzten Jahren habe ich mich vom direkten Kundensupport zur Teamleitung und später in den Bereich Lernen und Entwicklung vorgearbeitet. Dieser Weg half mir, das Gesamtbild zu verstehen — wie Kundenerfahrung, operative Effizienz und Teamleistung miteinander verbunden sind.",
    "page.aboutUs.bio3": "Ich bin spezialisiert auf die Erstellung strukturierter Schulungsprogramme, die Verbesserung von Arbeitsabläufen und die Unterstützung von Teams, durch bessere Kommunikation, Dokumentation und Prozessgestaltung intelligenter zu arbeiten. Ich verwandle gerne Komplexität in Klarheit.",
    "page.aboutUs.bio4": "Mein akademischer Hintergrund ist Bulgarische Philologie, wo ich auch Bulgarische Sprache und Literatur unterrichtete — eine Erfahrung, die meine Kommunikationsfähigkeiten und meine Fähigkeit, komplexe Ideen einfach zu erklären, stärkte.",
    "page.aboutUs.bio5": "Beruflich werde ich von Wachstum, Zusammenarbeit und bedeutsamer Wirkung angetrieben. Ich bin am besten in dynamischen Umgebungen, wo ich analytisches Denken mit Kreativität kombinieren kann.",

    "page.aboutPlatform.title": "Über die Plattform",
    "page.aboutPlatform.subtitle": "Unsere Mission",
    "page.aboutPlatform.content": "AI Tools Platform zielt darauf ab, jedem zu helfen — von kompletten Anfängern bis hin zu Programmierern, Marketing-Spezialisten und Fachleuten aus allen Branchen — die am besten geeigneten KI-Tools für ihre Bedürfnisse leichter zu finden. Wir glauben, dass der Zugang zu den richtigen Werkzeugen die Art und Weise, wie wir arbeiten und kreieren, transformieren kann.",

    "page.futureProjects.title": "Zukünftige Projekte",
    "page.futureProjects.subtitle": "Was kommt",
    "page.futureProjects.intro": "Wir arbeiten kontinuierlich an der Verbesserung der Plattform. Hier ist, was wir planen:",
    "page.futureProjects.item1": "KI-gestützte Tool-Empfehlungen basierend auf Ihren Bedürfnissen",
    "page.futureProjects.item2": "Integration mit beliebten Arbeitstools (Slack, Teams)",
    "page.futureProjects.item3": "Mobile App für iOS und Android",
    "page.futureProjects.item4": "Erweitertes Tool-Vergleichssystem",
    "page.futureProjects.item5": "Community und Forum zum Erfahrungsaustausch",

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
    "auth.registerSubtitle": "Neues Konto bei AI Tools Platform erstellen",
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
