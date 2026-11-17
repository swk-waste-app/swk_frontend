// Where to put a bin on collection day. Every colour comes from the neutral
// or brand scale, so the drawing follows dark mode and the deployment's colour.

const NEUTRAL = 'fill-gray-400 dark:fill-gray-600';
const NEUTRAL_DARK = 'fill-gray-500';
const WHEEL = 'fill-gray-900 dark:fill-gray-950';
const ARROW = 'fill-none stroke-brand-600 dark:stroke-brand-400';

const Measurement = ({ x1, y1, x2, y2, label, labelX, labelY, anchor = 'middle' }) => (
  <g>
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      className={ARROW}
      strokeWidth="2"
      strokeDasharray="6 5"
      markerStart="url(#binArrowStart)"
      markerEnd="url(#binArrowEnd)"
    />
    <text x={labelX} y={labelY} textAnchor={anchor} fontSize="15" fontWeight="600" className="fill-gray-900 dark:fill-gray-100">
      {label}
    </text>
  </g>
);

const TrashCanDiagram = () => (
  <svg viewBox="0 0 640 560" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full font-sans" role="img" aria-labelledby="binDiagramTitle">
    <title id="binDiagramTitle">
      Recommended bin placement: at the curb with the wheels toward the house, 5 feet from cars and trees,
      and 3 feet from other bins and from the mailbox.
    </title>

    <defs>
      <marker id="binArrowStart" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M7,1 L1,4 L7,7" className={ARROW} strokeWidth="1.6" />
      </marker>
      <marker id="binArrowEnd" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M1,1 L7,4 L1,7" className={ARROW} strokeWidth="1.6" />
      </marker>
    </defs>

    <rect width="640" height="560" className="fill-gray-50 dark:fill-gray-900" />

    {/* Driveway and house */}
    <rect x="220" y="60" width="200" height="380" className="fill-gray-200 dark:fill-gray-800" />
    <g transform="translate(160,20)">
      <rect y="30" width="320" height="70" className="fill-gray-300 dark:fill-gray-700" />
      <polygon points="0,30 160,-30 320,30" className={NEUTRAL_DARK} />
      <rect x="130" y="55" width="60" height="45" className={NEUTRAL} />
    </g>

    {/* Curb and street */}
    <rect y="440" width="640" height="14" className={NEUTRAL} />
    <rect y="454" width="640" height="106" className="fill-gray-700 dark:fill-gray-800" />
    <text x="320" y="476" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-50">
      Wheels toward the house, handle out
    </text>

    {/* Tree */}
    <g transform="translate(70,150)">
      <rect x="14" y="55" width="12" height="35" className={NEUTRAL_DARK} />
      <circle cx="20" cy="35" r="34" className="fill-brand-300 dark:fill-brand-700" />
    </g>

    {/* Parked car */}
    <g transform="translate(470,165)">
      <rect y="20" width="110" height="34" rx="10" className={NEUTRAL_DARK} />
      <rect x="18" width="70" height="26" rx="8" className={NEUTRAL_DARK} />
      <rect x="24" y="4" width="24" height="16" rx="3" className="fill-gray-200 dark:fill-gray-300" />
      <rect x="54" y="4" width="24" height="16" rx="3" className="fill-gray-200 dark:fill-gray-300" />
      <circle cx="22" cy="56" r="11" className={WHEEL} />
      <circle cx="88" cy="56" r="11" className={WHEEL} />
    </g>

    {/* Neighbouring bin */}
    <g transform="translate(95,330)">
      <rect y="14" width="44" height="66" rx="6" className={NEUTRAL} />
      <rect x="-4" y="4" width="52" height="14" rx="4" className={NEUTRAL_DARK} />
    </g>

    {/* Mailbox */}
    <g transform="translate(500,340)">
      <rect x="14" y="30" width="8" height="45" className={NEUTRAL_DARK} />
      <rect y="6" width="42" height="26" rx="13" className={NEUTRAL} />
    </g>

    {/* Your bin, at the curb */}
    <g transform="translate(288,368)">
      <rect x="4" y="10" width="56" height="66" rx="8" className="fill-brand-600 dark:fill-brand-500" />
      <rect x="-2" width="68" height="16" rx="6" className="fill-brand-800 dark:fill-brand-700" />
      <circle cx="14" cy="80" r="7" className={WHEEL} />
      <circle cx="50" cy="80" r="7" className={WHEEL} />
    </g>

    <Measurement x1="320" y1="360" x2="320" y2="215" label="5 ft from cars and trees" labelX="320" labelY="200" />
    <Measurement x1="270" y1="400" x2="150" y2="365" label="3 ft from other bins" labelX="95" labelY="310" anchor="start" />
    <Measurement x1="365" y1="400" x2="495" y2="375" label="3 ft from mailbox" labelX="615" labelY="310" anchor="end" />
  </svg>
);

export default TrashCanDiagram;
