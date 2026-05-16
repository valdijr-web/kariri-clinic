## Projeto Next APP KARIRI CLINIC


## Bibliotecas útilizadas
- Shadcn
- Nuqs
- QS @types
- lodash(debounce)
- swr
- react-hook-form
- hookform/resolvers
- tanstack/react-table
- tailwind CSS

## Estrutura de diretórios
```text
src/
├── components/
│   ├── ui/               # Botões, inputs, cards (puros)
│   ├── layout/           # Sidebar, Navbar, SiteHeader, NavUser (O que você está em dúvida)
│   ├── common/           # DataTable, ConfirmDialog, StatusSwitch
│   └── features/         # Componentes com regra de negócio (ex: PatientCard)
├── hooks/
│   ├── use-auth.ts
│   └── use-confirm.ts
├── app/                  # App Router (Next.js)
│   ├── (dashboard)/
│   │   ├── patients/
│   │   │   ├── _components/  # Componentes EXCLUSIVOS desta tela/módulo
│   │   │   │   ├── patient-form.tsx
│   │   │   │   └── medical-history-timeline.tsx
│   │   │   └── page.tsx
│   │   └── appointments/
│   │       ├── _components/
│   │       │   └── appointment-calendar.tsx
│   │       └── page.tsx
```