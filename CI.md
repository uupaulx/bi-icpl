# Corporate Identity Guidelines

> **Corporate Identity** หมายถึง อัตลักษณ์ขององค์กร ซึ่งเป็นสิ่งที่ออกแบบมาเพื่อให้สอดคล้องกับกลุ่มเป้าหมายทางธุรกิจ เป็นภาพลักษณ์ที่สื่อถึงผู้บริโภค

เอกสารนี้กำหนดมาตรฐานการใช้งานอัตลักษณ์องค์กรสำหรับการพัฒนาเว็บไซต์ แอปพลิเคชัน และสื่อดิจิทัลภายในบริษัท

---

## 1. Logo (ตราสัญลักษณ์องค์กร)

### Primary Logo
```
Path: https://i.ibb.co/N2Q7tpfM/ICP-ladda-logo-White-01.png
Path: https://i.ibb.co/4wdW4yvd/ICP-ladda-logo-01-Copy.png
```

### Logo Variations
| Type | File | Usage |
|------|------|-------|
| Primary (Full Color) | `ICP-ladda-logo-01-Copy.png` | ใช้งานทั่วไปบนพื้นหลังสีขาว/อ่อน |
| White (Reversed) | `ICP-ladda-logo-White-01.png` | ใช้บนพื้นหลังสีเข้ม |
| Monochrome | `ICP-ladda-logo-White-01.png` | ใช้ในกรณีพิมพ์ขาวดำ |
| Icon Only | `ICP-ladda-logo-01-Copy.png` | ใช้เป็น Favicon หรือ App Icon |

### Logo Usage Rules
- **Minimum Size**: 32px (height) สำหรับ digital
- **Clear Space**: ต้องมีพื้นที่ว่างรอบโลโก้อย่างน้อย 1x ของความสูงโลโก้
- **ห้าม**: บิดเบือน, เปลี่ยนสี, ใส่เอฟเฟกต์, วางบนพื้นหลังที่ทำให้มองไม่ชัด

---

## 2. Typography (รูปแบบตัวอักษร)

### Primary Font - สำหรับชื่อการค้า (Trade Name)
```css
/* Font for Trade Names / Product Names */
font-family: 'DB Sathorn X', sans-serif;
```

**ตัวอย่างการใช้งาน:**
- ชื่อสินค้า: **ราเซอร์** | **โทมาฮอค** | **พรีดิคท์ 10%**

### Font Stack (Web/App)
```css
:root {
  /* Primary Font - Trade Names, Headlines */
  --font-primary: 'DB Sathorn X', 'Noto Sans Thai', sans-serif;
  
  /* Secondary Font - Body Text */
  --font-secondary: 'Noto Sans Thai', 'Sarabun', sans-serif;
  
  /* Monospace - Code */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Font Sizes (Typography Scale)
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

### Font Weights
```css
:root {
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

---

## 3. Colors (สี)

### Primary Color - สีน้ำเงิน (สีหลักในการทำสื่อ)

| Format | Value | CSS Variable |
|--------|-------|--------------|
| **HEX** | `#004F9F` | `--color-primary` |
| **RGB** | `rgb(0, 79, 159)` | - |
| **CMYK** | `C100 M70 Y0 K0` | - |
| **Pantone** | `286 C` | - |

### Color Palette
```css
:root {
  /* Primary Colors */
  --color-primary: #004F9F;
  --color-primary-light: #3373B3;
  --color-primary-dark: #003A75;
  --color-primary-50: #E6EEF7;
  --color-primary-100: #CCE0F0;
  --color-primary-200: #99C1E1;
  --color-primary-300: #66A3D1;
  --color-primary-400: #3384C2;
  --color-primary-500: #004F9F;
  --color-primary-600: #003F7F;
  --color-primary-700: #002F5F;
  --color-primary-800: #002040;
  --color-primary-900: #001020;

  /* Secondary Colors */
  --color-secondary: #28A745;
  --color-secondary-light: #5DD879;
  --color-secondary-dark: #1E7E34;

  /* Accent Colors */
  --color-accent: #FFC107;
  --color-accent-light: #FFD54F;
  --color-accent-dark: #FFA000;

  /* Neutral Colors */
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;

  /* Semantic Colors */
  --color-success: #28A745;
  --color-warning: #FFC107;
  --color-error: #DC3545;
  --color-info: #17A2B8;
}
```

### Color Usage Guidelines
| Use Case | Color Variable |
|----------|----------------|
| Primary buttons, Links | `--color-primary` |
| Headers, Navigation | `--color-primary` |
| Success messages | `--color-success` |
| Warning messages | `--color-warning` |
| Error messages | `--color-error` |
| Body text | `--color-gray-800` |
| Secondary text | `--color-gray-600` |
| Borders | `--color-gray-200` |
| Background | `--color-gray-50` |

---

## 4. Spacing (ระยะห่าง)

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

---

## 5. Border Radius (ความโค้งมน)

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;  /* 2px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;  /* Pill shape */
}
```

---

## 6. Shadows (เงา)

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

---

## 7. Breakpoints (Responsive)

```css
:root {
  --breakpoint-sm: 640px;   /* Mobile landscape */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
  --breakpoint-2xl: 1536px; /* Extra large */
}
```

### Media Query Usage
```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## 8. Component Styles

### Buttons
```css
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-white);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
}
```

### Cards
```css
.card {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
}
```

### Input Fields
```css
.input {
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-100);
}
```

---

## 9. Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EEF7',
          100: '#CCE0F0',
          200: '#99C1E1',
          300: '#66A3D1',
          400: '#3384C2',
          500: '#004F9F',
          600: '#003F7F',
          700: '#002F5F',
          800: '#002040',
          900: '#001020',
          DEFAULT: '#004F9F',
        },
        secondary: {
          light: '#5DD879',
          DEFAULT: '#28A745',
          dark: '#1E7E34',
        },
      },
      fontFamily: {
        'primary': ['DB Sathorn X', 'Noto Sans Thai', 'sans-serif'],
        'secondary': ['Noto Sans Thai', 'Sarabun', 'sans-serif'],
      },
    },
  },
}
```

---

## 10. File Structure

```
/assets
├── /logos
│   ├── logo-primary.svg
│   ├── logo-primary.png
│   ├── logo-white.svg
│   ├── logo-mono.svg
│   └── logo-icon.svg
├── /fonts
│   ├── DBSathornX-Regular.woff2
│   ├── DBSathornX-Bold.woff2
│   └── ...
├── /icons
│   └── ...
└── /images
    └── ...

/styles
├── variables.css       # CSS Custom Properties
├── typography.css      # Font styles
├── components.css      # Component styles
└── main.css           # Main stylesheet
```


---

*เอกสารนี้เป็นแนวทางการใช้งานอัตลักษณ์องค์กร กรุณาปฏิบัติตามอย่างเคร่งครัดเพื่อความเป็นเอกภาพของแบรนด์*