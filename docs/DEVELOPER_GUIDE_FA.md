# راهنمای توسعه‌دهنده — استفاده در پروژه‌های ریشه

## این پکیج دقیقاً چه می‌کند؟
قرارداد TypeScript برای گزارش، اعتبارسنجی ساختار، نمایش React و تبدیل داده به PDF/DOCX را فراهم می‌کند. **یک سرویس میزبانی‌شده یا API آنلاین نیست**؛ کد منبعی است که باید در پروژه ادغام و تست شود.

## پیش‌نیاز
Node.js نسخه ۲۲ یا جدیدتر، npm، Git و یک پروژه React/TypeScript. قبل از ادغام، مجوز و وابستگی‌ها را بررسی کن.

## راه‌اندازی مخزن
```bash
git clone https://github.com/mahamirmh/RISHEH-Visual-Reporting-Design-System.git
cd RISHEH-Visual-Reporting-Design-System
npm install
npm run check
npm run build
npm run demo
```
**نکته:** اگر مخزن خصوصی باشد، دسترسی GitHub لازم است. این دستورها نمونه‌اند و موفقیت اجرا هنوز باید در سیستم شما تأیید شود.

## Report IR چیست؟
یک شیء با فیلدهای اجباری: `schemaVersion` نسخه قرارداد، `id` شناسه گزارش، `title` عنوان، `locale` زبان، `summary` خلاصه، `generatedAt` زمان ساخت، `sources` منابع و `blocks` محتوای بخش‌ها.

### مثال مینیمال با داده ساختگی
```ts
import {parseReport,assertReport} from "./src/index.js";
const report=parseReport({
 schemaVersion:"1.0",id:"ava-demo",title:"گزارش آزمایشی آوا",
 locale:"fa",summary:"تمام اعداد ساختگی‌اند.",
 generatedAt:"2026-10-28T00:00:00Z",sources:[],
 blocks:[
  {id:"total",kind:"metric",title:"درخواست‌ها",value:24,unit:"عدد"},
  {id:"trend",kind:"line",title:"روند فرضی",xKey:"month",yKey:"count",
   alt:"افزایش درخواست‌ها از ۱۲ به ۲۴ در سه ماه",
   rows:[{month:"فروردین",count:12},{month:"اردیبهشت",count:18},{month:"خرداد",count:24}]}
 ]
});
assertReport(report);
```

**تفاوت دو تابع:** `parseReport` ساختار ورودی نامطمئن را با Schema بررسی می‌کند؛ `assertReport` قواعد معنایی گزارش را می‌سنجد. برای داده خارجی، **هر دو** لازم‌اند.

### نمایش React
```tsx
import {ReportView} from "./src/react.js";
export function Page(){return <ReportView report={report}/>;}
```
در پروژه واقعی مسیر Import را متناسب با ساختار بسته/مونوریپو تنظیم کن. این مخزن فعلاً `private: true` است و قرارداد انتشار npm ندارد.

### خروجی Word و PDF
```ts
import {toDocx,toPdf} from "./src/export.js";
const docxBytes=await toDocx(report);
const pdfBytes=await toPdf(report,{fontPath:"/absolute/path/to/licensed-persian-font.ttf"});
```
مسیر فونت باید در **محیط سرور** معتبر باشد. فونت اختصاصی را در مخزن عمومی قرار نده. ساخت فایل PDF به معنی تأیید اتصال حروف فارسی نیست.

## انتخاب نوع Block
| نوع | ورودی اصلی | مورد استفاده |
|---|---|---|
| paragraph/callout | text | توضیح و هشدار |
| metric | value, unit | یک شاخص |
| table | rows | داده دقیق |
| bar/line/pie | rows, xKey, yKey | داده عددی |
| timeline/flow | steps | توالی یا فرایند |

## قبل از استفاده در محصول
- نمونه را با داده ساختگی اجرا کن.
- خروجی React، PDF و Word را با یک ورودی مقایسه کن.
- دسترس‌پذیری و RTL را در مرورگر واقعی بررسی کن.
- تست‌های `npm run check`، `npm run build` و `npm run test:e2e` را اجرا کن.
- برای نمودارهای شلوغ، نمایش جدول را ترجیح بده.
- وضعیت انتشار را از [راهنمای QA](QA_HANDBOOK_FA.md) بررسی کن.

**محدودیت فعلی:** این کتابخانه هنوز به‌عنوان بسته Production-ready تأیید نشده است؛ قبل از استفاده در پروژه مشتری نیازمند آزمون و بازبینی است.
