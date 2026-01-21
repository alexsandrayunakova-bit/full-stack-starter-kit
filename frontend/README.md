# AI Tools Platform - Frontend

Модерен Next.js 15 фронтенд с TypeScript и Tailwind CSS за управление на AI инструменти.

## 🚀 Бързо стартиране

### Локално развитие

```bash
# Инсталирайте зависимостите
npm install

# Стартирайте development сървъра
npm run dev

# Отворете http://localhost:3000
```

### Production build

```bash
npm run build
npm start
```

## 📁 Структура на проекта

```
frontend/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard страница
│   ├── login/               # Login страница
│   ├── profile/             # Потребителски профил
│   ├── tools/              # Инструменти
│   │   ├── [id]/           # Детайлна страница
│   │   ├── new/            # Добавяне на тул
│   │   └── page.tsx        # Списък с тулове
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Начална страница
│   └── globals.css         # Глобални стилове
├── components/
│   ├── layout/             # Layout компоненти
│   │   ├── AppLayout.tsx   # Главен layout с навигация
│   │   └── Navbar.tsx      # Навигационна лента
│   └── ui/                 # UI компоненти
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Loading.tsx
│       ├── Modal.tsx
│       ├── Textarea.tsx
│       └── Toast.tsx
├── contexts/
│   └── AuthContext.tsx     # Автентификация
├── lib/
│   ├── api.ts             # API клиент
│   └── types.ts           # TypeScript типове
└── public/                # Статични файлове
```

## 🎨 UI/UX Особености

### Цветова схема
- **Primary (Син)**: #3b82f6 - Основни бутони и акценти
- **Secondary (Лилав)**: #a855f7 - Вторични акценти
- **Gradient фонове**: Съчетание от primary, secondary и неутрални цветове

### Компоненти

#### Card
```tsx
import Card, { CardHeader, CardBody } from '@/components/ui/Card';

<Card hover>
  <CardHeader>Заглавие</CardHeader>
  <CardBody>Съдържание</CardBody>
</Card>
```

#### Button
```tsx
import Button from '@/components/ui/Button';

<Button variant="primary" size="md">
  Натисни ме
</Button>
```

#### Toast Notifications
```tsx
import { useToast } from '@/components/ui/Toast';

const { showToast } = useToast();
showToast("Успешно!", "success");
```

#### Modal
```tsx
import Modal from '@/components/ui/Modal';

<Modal isOpen={open} onClose={() => setOpen(false)} title="Заглавие">
  Съдържание
</Modal>
```

## 🔐 Автентификация

Използва се AuthContext за управление на автентификацията:

```tsx
import { useAuth } from '@/contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

## 🌐 API Интеграция

API клиентът автоматично добавя Bearer token към всички заявки:

```tsx
import api from '@/lib/api';

// GET заявка
const response = await api.get<ToolsResponse>('/api/tools');

// POST заявка
const response = await api.post('/api/tools', data);
```

## 📱 Responsive Design

Всички компоненти са оптимизирани за:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## ♿ Достъпност

- ✅ Правилен контраст на цветовете (WCAG AA)
- ✅ Focus states за всички интерактивни елементи
- ✅ ARIA labels и role атрибути
- ✅ Keyboard navigation
- ✅ "Skip to main content" линк
- ✅ Семантични HTML елементи

## 🔧 Конфигурация

### Environment Variables

Създайте `.env.local` файл:

```env
NEXT_PUBLIC_API_URL=http://localhost:8201
```

### Tailwind Configuration

Персонализирайте цветовете в `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },
  secondary: { ... }
}
```

## 🧪 Развитие

### Добавяне на нова страница

1. Създайте файл в `app/`
2. Експортирайте default функция като React компонент
3. Използвайте AppLayout за консистентен layout

```tsx
import AppLayout from '@/components/layout/AppLayout';

export default function NewPage() {
  return (
    <AppLayout>
      <div>Съдържание</div>
    </AppLayout>
  );
}
```

### Добавяне на UI компонент

Създайте файл в `components/ui/` и експортирайте компонента.

## 📦 Зависимости

- **Next.js 15**: React framework
- **React 19**: UI библиотека
- **TypeScript 5**: Type safety
- **Tailwind CSS 3**: Utility-first CSS
- **Inter Font**: Основен шрифт (с Cyrillic support)

## 🌍 Езици

Приложението е на български език. За добавяне на други езици:
1. Използвайте i18n библиотека (next-intl)
2. Създайте translation файлове
3. Обновете layout.tsx

## 🚦 Статуси и грешки

Toast notifications показват:
- ✅ Success (зелен)
- ❌ Error (червен)
- ℹ️ Info (син)
- ⚠️ Warning (жълт)

## 🔄 Следващи стъпки

- [ ] Добавяне на Register страница
- [ ] Редактиране на профил
- [ ] Image upload функционалност
- [ ] Препоръки и рейтинги
- [ ] Търсене с debounce
- [ ] Pagination
- [ ] Dark mode toggle
- [ ] SEO оптимизация

## 📞 Поддръжка

За проблеми и въпроси, моля отворете issue в GitHub.

---

**Създадено с ❤️ за AI Tools Platform**
