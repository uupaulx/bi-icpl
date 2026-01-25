# Product Requirements Document (PRD)

# BI Report Portal

**ระบบแสดงผล Power BI Reports พร้อมการจัดการสิทธิ์การเข้าถึง**

---

| Field | Value |
|-------|-------|
| Project Name | BI Report Portal |
| Version | 1.0 |
| Last Updated | January 2026 |
| Status | Draft |

---

## 1. Executive Summary

BI Report Portal เป็นเว็บแอปพลิเคชันสำหรับแสดงผล Power BI Reports แบบ Public Embed โดยมีระบบจัดการสิทธิ์การเข้าถึงตาม User และ Department ระบบนี้ออกแบบมาเพื่อให้พนักงานในองค์กรสามารถเข้าถึง Reports ที่เกี่ยวข้องกับตนเองได้อย่างปลอดภัย โดยมี Admin เป็นผู้กำหนดสิทธิ์การเข้าถึง

---

## 2. Problem Statement

### 2.1 Current Challenges

- พนักงานไม่มีช่องทางที่สะดวกในการเข้าถึง Power BI Reports
- ไม่สามารถควบคุมสิทธิ์การเข้าถึง Reports ตามแผนกหรือตำแหน่งได้
- ต้องการระบบ Authentication ที่เชื่อมต่อกับ Microsoft Account ขององค์กร
- Admin ต้องการความยืดหยุ่นในการกำหนดว่า User ไหนเห็น Report ใด

---

## 3. Goals & Objectives

### 3.1 Primary Goals

1. สร้างระบบ Web Portal สำหรับแสดงผล Power BI Reports แบบ Centralized
2. ใช้ Microsoft Authentication เพื่อความปลอดภัยและความสะดวก
3. Admin สามารถจัดการ Reports และกำหนดสิทธิ์การเข้าถึงได้อย่างยืดหยุ่น
4. User เห็นเฉพาะ Reports ที่ได้รับสิทธิ์เท่านั้น

---

## 4. User Roles & Personas

### 4.1 Admin

ผู้ดูแลระบบที่มีสิทธิ์จัดการ Reports และกำหนดสิทธิ์การเข้าถึงให้กับ Users

- สามารถเพิ่ม แก้ไข ลบ Embedded Reports ได้
- สามารถกำหนดว่า User (Email) ไหนเห็น Report ใดได้
- สามารถดู Reports ทั้งหมดในระบบได้
- สามารถจัดการ Users และดู Activity Logs ได้

### 4.2 User (พนักงาน)

พนักงานทั่วไปที่ Login เข้าระบบด้วย Microsoft Account

- หลัง Login จะยังไม่เห็น Report ใดๆ จนกว่า Admin จะกำหนดสิทธิ์
- เห็นเฉพาะ Reports ที่ Admin กำหนดให้ดูได้เท่านั้น
- สามารถดูและ Interact กับ Reports ที่ได้รับสิทธิ์

---

## 5. Functional Requirements

### 5.1 Authentication System

| ID | Requirement | Description |
|----|-------------|-------------|
| AUTH-01 | Microsoft SSO | ระบบต้องรองรับการ Login ด้วย Microsoft Account (Azure AD/Entra ID) เท่านั้น |
| AUTH-02 | User Registration | User ที่ Login ครั้งแรกจะถูกบันทึกข้อมูลเข้าระบบอัตโนมัติ (Email, Name, Profile) |
| AUTH-03 | Session Management | ระบบต้องจัดการ Session และ Token Refresh อัตโนมัติ |
| AUTH-04 | Role Assignment | Admin สามารถกำหนด Role (Admin/User) ให้กับ Users ได้ |

### 5.2 Report Management (Admin)

| ID | Requirement | Description |
|----|-------------|-------------|
| RPT-01 | Create Report | Admin สามารถเพิ่ม Report ใหม่โดยระบุ: ชื่อ, คำอธิบาย, Power BI Embed URL, หมวดหมู่ |
| RPT-02 | Edit Report | Admin สามารถแก้ไขข้อมูล Report ที่มีอยู่ได้ |
| RPT-03 | Delete Report | Admin สามารถลบ Report ได้ (Soft Delete เพื่อเก็บประวัติ) |
| RPT-04 | Report Categories | Admin สามารถจัดกลุ่ม Reports ตามหมวดหมู่ได้ (Sales, HR, Finance, etc.) |
| RPT-05 | Report Status | Admin สามารถเปิด/ปิดการแสดงผล Report ได้ (Active/Inactive) |

### 5.3 Access Control

| ID | Requirement | Description |
|----|-------------|-------------|
| ACC-01 | User-Report Mapping | Admin สามารถกำหนดว่า User (ระบุด้วย Email) ไหนมีสิทธิ์ดู Report ใดได้ |
| ACC-02 | Bulk Assignment | Admin สามารถกำหนดสิทธิ์ให้หลาย Users พร้อมกันได้ |
| ACC-03 | Department-based Access | Admin สามารถกำหนดสิทธิ์ตาม Department ได้ (Optional) |
| ACC-04 | Default No Access | User ที่ Login ใหม่จะไม่เห็น Report ใดๆ จนกว่า Admin จะกำหนดสิทธิ์ |
| ACC-05 | Revoke Access | Admin สามารถยกเลิกสิทธิ์การเข้าถึง Report ของ User ได้ทันที |

### 5.4 User Dashboard

| ID | Requirement | Description |
|----|-------------|-------------|
| USR-01 | Report List | User เห็นรายการ Reports ที่ตนเองมีสิทธิ์เข้าถึงเท่านั้น |
| USR-02 | Report Viewer | User สามารถเปิดดู Report แบบ Embedded ได้ภายในระบบ |
| USR-03 | Search & Filter | User สามารถค้นหาและกรอง Reports ตามชื่อหรือหมวดหมู่ได้ |
| USR-04 | Favorites | User สามารถเพิ่ม Reports ที่ใช้บ่อยเป็น Favorites ได้ |
| USR-05 | Empty State | แสดงข้อความแจ้งเตือนเมื่อ User ยังไม่มี Reports ที่เข้าถึงได้ |

---

## 6. System Architecture & Logic Analysis

### 6.1 High-Level Architecture

ระบบประกอบด้วย 3 ส่วนหลัก:

1. **Frontend (Web Application)** - React/Next.js
2. **Backend (API Server)** - Node.js/Express หรือ .NET Core
3. **Database** - PostgreSQL หรือ SQL Server

### 6.2 Data Model

#### 6.2.1 Users Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| email | VARCHAR(255) | Microsoft Account Email (Unique) |
| display_name | VARCHAR(255) | ชื่อที่แสดงจาก Microsoft Profile |
| role | ENUM | 'admin' หรือ 'user' (Default: 'user') |
| department | VARCHAR(100) | แผนก (Optional - ดึงจาก Azure AD) |
| is_active | BOOLEAN | สถานะ Active/Inactive |
| created_at | TIMESTAMP | วันที่สร้าง |
| last_login | TIMESTAMP | วันที่ Login ล่าสุด |

#### 6.2.2 Reports Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| name | VARCHAR(255) | ชื่อ Report |
| description | TEXT | คำอธิบาย Report |
| embed_url | TEXT | Power BI Public Embed URL |
| category_id | UUID | FK to Categories Table |
| sort_order | INTEGER | ลำดับการแสดงผลภายใน Category (Default: 0) |
| is_active | BOOLEAN | สถานะ Active/Inactive |
| created_by | UUID | FK to Users (Admin ที่สร้าง) |
| created_at | TIMESTAMP | วันที่สร้าง |

#### 6.2.3 User_Report_Access Table (Many-to-Many)

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | FK to Users |
| report_id | UUID | FK to Reports |
| granted_by | UUID | FK to Users (Admin ที่ให้สิทธิ์) |
| granted_at | TIMESTAMP | วันที่ให้สิทธิ์ |

#### 6.2.4 Categories Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| name | VARCHAR(100) | ชื่อหมวดหมู่ (Sales, HR, Finance, etc.) |
| description | TEXT | คำอธิบายหมวดหมู่ |
| icon | VARCHAR(50) | Icon สำหรับแสดงใน Menu (เช่น chart-bar, users, dollar) |
| sort_order | INTEGER | ลำดับการแสดงผลใน Menu (Default: 0) |

### 6.3 Core Logic Flows

#### 6.3.1 Authentication Flow

1. User คลิก "Login with Microsoft"
2. Redirect ไป Microsoft OAuth (Azure AD/Entra ID)
3. User ยืนยันตัวตนกับ Microsoft
4. Microsoft Redirect กลับพร้อม Authorization Code
5. Backend แลก Code เป็น Access Token + ID Token
6. ดึง User Profile จาก Microsoft Graph API
7. ตรวจสอบว่า Email มีในระบบหรือไม่:
   - ถ้าไม่มี: สร้าง User ใหม่ (role = 'user', ไม่มีสิทธิ์ดู Report ใดๆ)
   - ถ้ามี: อัพเดท last_login
8. สร้าง JWT Token สำหรับ Session
9. Redirect User ไป Dashboard

#### 6.3.2 Report Access Logic

เมื่อ User ร้องขอดู Reports:

1. ตรวจสอบ JWT Token ว่า Valid หรือไม่
2. ดึง User ID จาก Token
3. Query Reports ที่ User มีสิทธิ์:

```sql
SELECT r.* FROM reports r
INNER JOIN user_report_access ura ON r.id = ura.report_id
WHERE ura.user_id = :userId AND r.is_active = true
ORDER BY r.sort_order, r.name
```

4. ถ้าไม่มี Reports: แสดง Empty State
5. ถ้ามี Reports: แสดงรายการ Reports

#### 6.3.3 Admin Grant Access Logic

เมื่อ Admin กำหนดสิทธิ์ให้ User:

1. ตรวจสอบว่า Admin มี role = 'admin'
2. รับข้อมูล: User Email(s) + Report ID(s)
3. ตรวจสอบว่า Email(s) มีในระบบหรือไม่:
   - ถ้าไม่มี: สร้าง User Placeholder หรือแจ้ง Error
4. สร้าง Records ใน user_report_access Table
5. บันทึก granted_by และ granted_at
6. (Optional) ส่ง Email แจ้ง User ว่าได้รับสิทธิ์ใหม่

#### 6.3.4 View Report Logic

เมื่อ User เปิดดู Report:

1. ตรวจสอบว่า User มีสิทธิ์ดู Report นี้หรือไม่
2. ถ้าไม่มีสิทธิ์: Return 403 Forbidden
3. ถ้ามีสิทธิ์: ดึง embed_url จาก Reports Table
4. Render Power BI iframe ด้วย embed_url
5. บันทึก Activity Log (User, Report, Timestamp)

---

## 7. API Endpoints

### 7.1 Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/auth/login | Redirect to Microsoft OAuth |
| GET | /api/auth/callback | OAuth callback handler |
| POST | /api/auth/logout | Logout and clear session |
| GET | /api/auth/me | Get current user profile |

### 7.2 Report APIs (User)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/menu | Get menu structure (Categories + Reports user has access) |
| GET | /api/reports | Get all reports user has access to (flat list) |
| GET | /api/reports/:id | Get specific report (with access check) |
| GET | /api/reports/:id/embed | Get embed URL for report |
| GET | /api/categories | Get all categories (for reference) |

### 7.3 Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/reports | Get all reports |
| POST | /api/admin/reports | Create new report |
| PUT | /api/admin/reports/:id | Update report |
| DELETE | /api/admin/reports/:id | Delete report (soft delete) |
| GET | /api/admin/users | Get all users |
| PUT | /api/admin/users/:id/role | Update user role |
| POST | /api/admin/access/grant | Grant report access to users |
| POST | /api/admin/access/revoke | Revoke report access from users |
| GET | /api/admin/reports/:id/users | Get users with access to report |
| GET | /api/admin/users/:id/reports | Get reports user has access to |
| GET | /api/admin/categories | Get all categories |
| POST | /api/admin/categories | Create new category |
| PUT | /api/admin/categories/:id | Update category (name, icon, sort_order) |
| DELETE | /api/admin/categories/:id | Delete category (must have no reports) |

---

## 8. UI/UX Requirements

### 8.1 Menu Structure

ระบบใช้ Sidebar Navigation แบบ Category → Reports (Collapsible Menu):

```
┌─────────────────┬────────────────────────────────┐
│  📊 BI Portal   │  Sales Daily Report            │
├─────────────────┼────────────────────────────────┤
│                 │                                │
│  ▼ Sales        │   ┌────────────────────────┐   │
│    • Daily  ◄───│   │                        │   │
│    • Monthly    │   │   [Power BI iframe]    │   │
│    • YTD        │   │                        │   │
│                 │   │                        │   │
│  ▸ HR           │   └────────────────────────┘   │
│  ▸ Finance      │                                │
│  ▸ Marketing    │                                │
│                 │                                │
└─────────────────┴────────────────────────────────┘
```

#### 8.1.1 Menu Behavior

- **Category (เมนูหลัก)**: คลิกเพื่อ Expand/Collapse แสดง Reports ย่อย
- **Report (เมนูย่อย)**: คลิกเพื่อแสดง Power BI Report ในพื้นที่ขวา
- **Active State**: Highlight เมนูที่กำลังดูอยู่
- **Remember State**: จำสถานะ Expand/Collapse ของ User

#### 8.1.2 Menu Visibility Logic

User จะเห็นเฉพาะ Category และ Reports ที่ตนเองมีสิทธิ์:

```sql
-- ดึง Categories ที่ User มีสิทธิ์ดู Report อย่างน้อย 1 ตัว
SELECT DISTINCT c.* FROM categories c
INNER JOIN reports r ON c.id = r.category_id
INNER JOIN user_report_access ura ON r.id = ura.report_id
WHERE ura.user_id = :userId
  AND r.is_active = true
ORDER BY c.sort_order, c.name
```

#### 8.1.3 Menu Display Rules

| Condition | Display |
|-----------|---------|
| User ไม่มีสิทธิ์ Report ใดเลย | แสดง Empty State: "ยังไม่มี Report ที่คุณสามารถเข้าถึงได้ กรุณาติดต่อ Admin" |
| Category ไม่มี Report ที่มีสิทธิ์ | ซ่อน Category นั้นจาก Menu |
| Report ถูก Inactive | ซ่อน Report นั้นจาก Menu (แม้เคยมีสิทธิ์) |
| User เป็น Admin | แสดง Menu พิเศษ: "⚙️ Admin Panel" ที่ด้านล่างของ Sidebar |

### 8.2 Pages Overview

1. **Login Page** - หน้า Login ด้วย Microsoft Button
2. **User Dashboard** - หน้าแสดง Reports ที่ User มีสิทธิ์
3. **Report Viewer** - หน้าแสดง Power BI Report (Embedded)
4. **Admin Dashboard** - หน้าจัดการ Reports และ Users
5. **Report Management** - หน้า CRUD Reports
6. **Access Management** - หน้ากำหนดสิทธิ์ User-Report

### 8.3 Key UI Components

- **Navigation Bar** - แสดงชื่อ User, Role, Logout Button
- **Report Card** - แสดงชื่อ Report, Category, Description, Thumbnail
- **Search Bar** - ค้นหา Reports ตามชื่อ
- **Category Filter** - กรอง Reports ตามหมวดหมู่
- **User Selector** - เลือก Users เพื่อกำหนดสิทธิ์ (Admin)
- **Empty State** - แสดงเมื่อไม่มี Reports

---

## 9. Data Classification & Security Guidelines

### 9.1 ข้อจำกัดของ Public Embed URL

> ⚠️ **IMPORTANT**: Public Embed URL หมายความว่าใครก็ตามที่มี URL สามารถเข้าดู Report ได้ ระบบ BI Portal ของเราทำหน้าที่ **"ซ่อน URL"** ไม่ใช่ **"ป้องกัน URL"** ที่ระดับ Power BI

#### 9.1.1 Risk Assessment

| Risk | Description | Impact |
|------|-------------|--------|
| URL Sharing | User ที่มีสิทธิ์ copy URL แชร์ต่อ | ผู้ไม่มีสิทธิ์สามารถเข้าดู Report ได้ |
| URL Leakage | URL หลุดจาก Browser History, Logs | ข้อมูลอาจถูกเข้าถึงโดยไม่ตั้งใจ |
| No Audit at PBI | Power BI ไม่ track ว่าใครดู Public Report | ไม่สามารถตรวจสอบการเข้าถึงจริงได้ |
| Permanent Access | URL ใช้ได้ตลอดจนกว่าจะ Unpublish | ยกเลิกสิทธิ์ใน Portal แต่ยังดูได้ถ้ามี URL |

### 9.2 Data Classification Matrix

Admin ต้องพิจารณา Data Classification ก่อน Publish Report เป็น Public URL:

| Classification | ประเภทข้อมูล | Public Embed | Action |
|----------------|-------------|--------------|--------|
| 🟢 **PUBLIC** | ข้อมูลทั่วไป, KPIs รวม, Summary Dashboard, ข้อมูลที่เปิดเผยต่อสาธารณะได้ | ✅ อนุญาต | ใช้งานได้ปกติ |
| 🟡 **INTERNAL** | ข้อมูลภายในแผนก, Performance Report, Sales/Revenue Aggregate | ⚠️ ระวัง | ใช้ได้ + User Agreement |
| 🔴 **CONFIDENTIAL** | ข้อมูลส่วนบุคคล, เงินเดือน, ข้อมูลลูกค้ารายบุคคล, ข้อมูลการเงินละเอียด | ❌ ห้าม | ใช้ PBI Embedded + RLS |
| ⚫ **RESTRICTED** | ความลับทางธุรกิจ, สัญญา, ข้อมูล M&A, Strategic Plans | 🚫 ห้ามเด็ดขาด | ไม่ควรอยู่ใน Power BI |

### 9.3 Mitigation Strategies

#### 9.3.1 Technical Mitigations

1. **ซ่อน URL จาก Frontend**: ไม่ render embed URL ตรงๆ ใน HTML source, ดึงผ่าน API เท่านั้น
2. **Audit Logging**: บันทึกทุกครั้งที่ User เปิดดู Report (User, Report, Timestamp, IP)
3. **Session-based Embed**: ส่ง embed URL เฉพาะใน authenticated session
4. **Referrer Check**: ตรวจสอบว่า request มาจาก domain ของเราเท่านั้น (limited effectiveness)

#### 9.3.2 Process Mitigations

1. **URL Rotation**: กำหนด Schedule ให้ Republish report ใหม่เป็นระยะ (เช่น ทุก 3-6 เดือน)
2. **Access Review**: ทบทวนสิทธิ์การเข้าถึงเป็นประจำ (Quarterly)
3. **Data Classification Review**: ตรวจสอบ Classification ของ Report ก่อน Publish

#### 9.3.3 Policy Mitigations

1. **User Agreement**: User ต้องยอมรับเงื่อนไขการใช้งานก่อนดู Report ครั้งแรก
2. **No Sharing Policy**: ห้ามแชร์ URL หรือ Screenshot ของ Report
3. **Violation Consequences**: กำหนดบทลงโทษกรณีละเมิดนโยบาย

### 9.4 Admin Checklist ก่อน Publish Report

- [ ] ตรวจสอบ Data Classification ของข้อมูลใน Report แล้ว
- [ ] ไม่มีข้อมูลส่วนบุคคล (PII) ใน Report
- [ ] ไม่มีข้อมูลการเงินที่ละเอียดอ่อน (Individual transactions, Account numbers)
- [ ] ไม่มีข้อมูลลูกค้ารายบุคคล
- [ ] ไม่มีความลับทางธุรกิจหรือข้อมูลเชิงกลยุทธ์
- [ ] ได้รับอนุมัติจาก Data Owner / Manager แล้ว
- [ ] กำหนด User ที่มีสิทธิ์เข้าถึงอย่างเหมาะสมแล้ว
- [ ] บันทึก URL และวันที่ Publish ไว้สำหรับ Rotation

### 9.5 User Agreement Template

```
ข้อตกลงการใช้งานระบบ BI Report Portal

1. ข้าพเจ้าจะไม่แชร์ URL หรือเนื้อหาของ Report ให้ผู้อื่นที่ไม่มีสิทธิ์
2. ข้าพเจ้าจะไม่ถ่ายภาพหน้าจอหรือบันทึกข้อมูลจาก Report เพื่อแชร์ต่อ
3. ข้าพเจ้าเข้าใจว่าการละเมิดข้อตกลงนี้อาจมีบทลงโทษทางวินัย
4. ข้าพเจ้ายินยอมให้บันทึก Activity การใช้งานของข้าพเจ้าในระบบ
```

---

## 10. Security Requirements

- **Authentication**: Microsoft OAuth 2.0 / Azure AD เท่านั้น
- **Authorization**: Role-based (Admin/User) + Report-level Access Control
- **HTTPS**: บังคับใช้ HTTPS ทั้งหมด
- **JWT Token**: ใช้ JWT สำหรับ Session Management
- **CORS**: จำกัด Origins ที่อนุญาต
- **Rate Limiting**: จำกัด API Requests
- **Audit Logging**: บันทึก Activity ทั้งหมด

---

## 11. Recommended Tech Stack

### 11.1 Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: React Query / SWR
- **Auth Library**: NextAuth.js (Azure AD Provider)

### 11.2 Backend

- **Option A**: Next.js API Routes (Full-stack)
- **Option B**: Node.js + Express (Separate API)
- **Option C**: .NET Core Web API

### 11.3 Database

- PostgreSQL หรือ SQL Server
- **ORM**: Prisma (Node.js) หรือ Entity Framework (.NET)

### 11.4 Deployment

- Azure App Service / Azure Container Apps
- Azure SQL Database

---

## 12. Project Timeline (Estimated)

| Phase | Tasks | Duration |
|-------|-------|----------|
| 1 | Setup + Authentication | 1-2 Weeks |
| 2 | Database + Basic APIs | 1-2 Weeks |
| 3 | Admin Dashboard + Report Management | 2-3 Weeks |
| 4 | User Dashboard + Report Viewer | 1-2 Weeks |
| 5 | Testing + Bug Fixes | 1-2 Weeks |
| 6 | Deployment + UAT | 1 Week |

**Total Estimated: 8-12 Weeks**

---

## 13. Success Metrics

- **User Adoption Rate**: >80% ของพนักงานที่ต้องใช้ Reports
- **Authentication Success Rate**: >99%
- **Page Load Time**: <3 seconds
- **System Uptime**: >99.5%
- **User Satisfaction Score**: >4/5

---

## 14. Appendix

### 14.1 Glossary

- **Power BI Public Embed**: การฝัง Report แบบไม่ต้อง Authenticate กับ Power BI
- **Azure AD / Entra ID**: ระบบ Identity Management ของ Microsoft
- **JWT**: JSON Web Token สำหรับ Authentication
- **RBAC**: Role-Based Access Control

### 14.2 Power BI Embed URL Format

```
https://app.powerbi.com/view?r=eyJrIjoiZmRhZGY3YjQtNDliMy00ZTA4LWFjZDctYWE2ZmU5Y2E5OTZkIiwidCI6IjJlNzNjYTEwLTdlMDItNDJjZS1hNGM4LWQ3MTIwMmU3YmM3MSIsImMiOjEwfQ%3D%3D
```

**Embed in iframe:**

```html
<iframe 
  title="Report Name"
  width="100%" 
  height="600"
  src="https://app.powerbi.com/view?r=eyJrIjoiZmRhZGY3YjQ..."
  frameborder="0" 
  allowFullScreen="true">
</iframe>
```

### 14.3 References

- Microsoft Identity Platform: https://docs.microsoft.com/azure/active-directory/develop/
- Power BI Embedded: https://docs.microsoft.com/power-bi/developer/embedded/
- NextAuth.js: https://next-auth.js.org/
