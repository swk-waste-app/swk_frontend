# Design system

The rules every screen in this product follows. The aim is an interface a
large operator would trust with its customers and its operations team: calm,
specific, consistent, and identical in behaviour from page to page.

## 1. The product is white-label

Nothing in a component names a company, a country, a currency or an image
host. Read them from one place:

```js
import { brand } from '@/config/brand'      // src/config/brand.js  (use a relative path)
brand.name          // product name shown to users        e.g. "Taka Kipawa"
brand.operator      // company running the deployment     e.g. "SWK Ghana"
brand.tagline, brand.country, brand.supportEmail, brand.siteUrl, brand.logo
```

```js
import { formatMoney, formatNumber, formatWeight, formatDate, formatDateTime, formatDay, timeAgo, mediaUrl } from '@/lib/format'
formatMoney(35)            // "GH₵35.00" (locale and currency come from the brand config)
formatDate(pickup.pickupDate)
mediaUrl(product.image)    // Cloudinary URL; never write res.cloudinary.com in a component
```

Never write "Taka Kipawa", "SWK", "Ghana", "Kipawa", "Accra", "GH₵", "GHS" or a
Cloudinary cloud name in a component. Example place names in placeholders are
written generically ("e.g. 14 Palm Street").

## 2. Words

- No em dashes, anywhere, including comments. Use a full stop, a comma, a
  colon or parentheses, and rewrite the sentence if needed. Use "to" for ranges.
- No emoji, anywhere. Meaning is carried by words and by icons from the icon set.
- No invented numbers. Do not show a statistic, an equivalence ("trees saved",
  "car trips avoided", "litres of water") or a claim ("100+ happy customers")
  unless it is computed from this deployment's own data. The only derived
  figure allowed is estimated CO2e avoided, and it is always labelled "estimated".
- No hype and no filler: avoid "effortless", "seamless", "amazing", "turning
  trash into treasure", "join the movement", exclamation marks.
- Sentence case for headings, buttons and labels ("Schedule pickup", not
  "Schedule Pickup"). Buttons say what happens: "Schedule pickup", "Save changes",
  "Cancel pickup".
- Errors say what went wrong and what to do next. No apologies.
- Name things the way the user does: "pickup", "household", "vendor",
  "operations", "listing". The person collecting waste is a "collector".

## 3. Colour

- `brand-*` is the deployment's colour (a 50 to 950 scale). Primary actions use
  `brand-700` in light mode. Do not write `green-*`; do not hard-code hex colours
  (charts read the CSS variables, see section 7).
- `gray-*` is the neutral scale. Most of every screen is neutral.
- Meaning uses a fixed set, only for state, never for decoration:
  success `emerald`, warning `amber`, danger `red`, information `sky`.
  Use the `Badge` / `StatusBadge` components instead of colouring text by hand.
- No other hues. No purple, teal, pink, blue or yellow as decoration, and no
  rainbow of differently coloured stat cards.
- No gradients, glows, blurred blobs or glass effects.
- Every surface must work in dark mode (`dark:` variants). The component
  classes already do; anything hand-written needs both.

## 4. Type

- `font-sans` (Inter) for everything; `h1` and `h2` use the display face
  automatically. Use `font-display` only for marketing headlines.
- Scale: page title `text-2xl font-bold`; section title `text-lg font-semibold`;
  body `text-sm` (app) or `text-base` (marketing); captions `text-xs`.
- Numbers that line up or update use `tabular-nums`.

## 5. Shape and depth

- Cards: `.card` (12px radius, hairline border, faint shadow). Controls: 8px
  (`rounded-lg`). Pills: `rounded-full`. Nothing larger than `rounded-xl`
  except the top corners of a bottom sheet.
- Depth comes from borders first. `shadow-card` on cards, `shadow-pop` on
  floating layers (menus, dialogs). No `shadow-lg/xl/2xl`.
- Spacing: `gap-*` on flex and grid parents. Page padding comes from `.page`.

## 6. Components (src/components/ui)

```js
import { Button, Card, PageHeader, StatCard, Badge, StatusBadge, EmptyState, Field, Modal, Spinner, BrandLogo } from '@/components/ui'
import { confirmAction } from '@/components/ui/confirm'
import { toast } from 'sonner'
```

| Need | Use |
|---|---|
| Page title, subtitle, primary action | `<PageHeader title description actions />` |
| Any button | `<Button variant="primary|secondary|ghost|danger" size icon loading>`; links that look like buttons: `<Button as={Link} to="...">` |
| A panel | `<Card className="p-5">` or the `.card` class |
| One figure | `<StatCard label value hint icon />` (neutral, no coloured borders) |
| Pickup state | `<StatusBadge status="Scheduled" />` |
| Any other state | `<Badge tone="success|warning|danger|info|brand|neutral">` |
| Nothing to show | `<EmptyState icon title description action />` |
| A form field | `<Field label htmlFor hint error optional>` wrapping an element with class `input` |
| A dialog | `<Modal open onClose title description footer>` |
| "Are you sure?" | `await confirmAction({ title, body, confirmLabel, tone: 'danger' })` |
| Success or failure of an action | `toast.success('Pickup scheduled')`, `toast.error(message)` |
| Loading | `Skeleton` blocks shaped like the content (src/components/Skeleton.jsx); `Spinner` only inside buttons |
| Tables | `<div class="table-wrap"><table class="table">` |

SweetAlert (`Swal`) is being removed: replace every use with `toast` or
`confirmAction`. Never use `alert()` or `window.confirm()`.

## 7. Icons and charts

- Icons: Lucide only, from `react-icons/lu`. Size `h-4 w-4` in buttons and
  labels, `h-5 w-5` standalone. Decorative icons get `aria-hidden="true"`.
  The installed version uses Lucide's current names. Confirmed to exist:
  LuHouse LuLayoutDashboard LuTruck LuRecycle LuLeaf LuBell LuCalendar LuCalendarPlus LuMapPin
  LuPackage LuShoppingBag LuStore LuCamera LuScanLine LuBot LuSparkles LuAward LuTrophy LuFlame
  LuCheck LuCircleCheck LuX LuCircleX LuClock LuLoaderCircle LuSearch LuPlus LuPencil LuTrash2
  LuLogOut LuMenu LuSun LuMoon LuUser LuUsers LuUserCheck LuSettings LuChartBar LuTrendingUp
  LuWeight LuScale LuCloud LuWind LuBookOpen LuNewspaper LuMessageCircle LuSend LuArrowRight
  LuArrowLeft LuChevronRight LuChevronLeft LuChevronDown LuStar LuEye LuEyeOff LuMail LuLock
  LuPhone LuFilter LuDownload LuUpload LuImage LuInfo LuTriangleAlert LuWifiOff LuClipboardList
  LuTicket LuBadgeCheck LuCircleDollarSign LuBanknote LuTag LuBoxes LuGlobe LuExternalLink
  LuRefreshCw LuShieldCheck LuZap LuCircleHelp LuTarget LuHistory LuRoute LuBuilding2
  LuSmartphone LuWifi LuCopy LuEllipsis LuPlay LuBan LuFileText
  These do NOT exist: LuHome, LuCheckCircle, LuXCircle, LuLoader2, LuBarChart3, LuAlertTriangle,
  LuHelpCircle, LuMoreHorizontal. Before using any other name, confirm it:
  `node -e "console.log(!!require('react-icons/lu').LuName)"`.
  Do not import from `react-icons/fa`, `ai`, `io` or any other set.
- Charts (Recharts): one series colour, `rgb(var(--brand-600))`; grid and axes
  `rgb(var(--gray-200))` / `rgb(var(--gray-500))`; no coloured-per-bar charts,
  no 3D, no legends for a single series. Tooltips use the card style.

## 8. Images

No stock or AI-generated imagery. Marketing surfaces show the product itself
(composed from real components), type, and icons. User-supplied photos
(products, articles) render through `mediaUrl()` with a neutral placeholder
when missing.

## 9. Behaviour every screen shares

- Loading, empty and error states are designed, not left blank.
- After an action succeeds the screen updates in place; no full page reloads,
  no blocking pop-ups.
- Destructive actions confirm first and say what will happen.
- Forms validate before submitting, show errors next to the field, keep the
  user's input on failure, and disable the submit button while saving.
- Everything is reachable by keyboard, with visible focus.
- Layouts work at 360px wide.
