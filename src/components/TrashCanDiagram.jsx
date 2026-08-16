const Measurement = ({ x1, y1, x2, y2, label, labelX, labelY, anchor = 'middle' }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#15803d" strokeWidth="2" strokeDasharray="6 5" markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
    <text x={labelX} y={labelY} textAnchor={anchor} fontSize="15" fontWeight="700" fill="#14532d" fontFamily="Montserrat, sans-serif">
      {label}
    </text>
  </g>
);

const TrashCanDiagram = () => (
  <svg viewBox="0 0 640 560" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-labelledby="trashDiagramTitle">
    <title id="trashDiagramTitle">Diagram showing recommended trash bin placement: 5 feet from cars and trees, 3 feet from other bins, 3 feet from the mailbox, wheels facing the house at the curb</title>

    <defs>
      <marker id="arrowStart" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M7,1 L1,4 L7,7" fill="none" stroke="#15803d" strokeWidth="1.6" />
      </marker>
      <marker id="arrowEnd" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M1,1 L7,4 L1,7" fill="none" stroke="#15803d" strokeWidth="1.6" />
      </marker>
    </defs>

    {/* card background */}
    <rect x="0" y="0" width="640" height="560" rx="28" fill="#f0fdf4" />

    {/* driveway */}
    <rect x="220" y="60" width="200" height="380" fill="#e5e7eb" />
    {/* driveway lane markings */}
    <rect x="316" y="70" width="8" height="24" fill="#ffffff" />
    <rect x="316" y="120" width="8" height="24" fill="#ffffff" />
    <rect x="316" y="170" width="8" height="24" fill="#ffffff" />

    {/* house */}
    <g transform="translate(160,20)">
      <rect x="0" y="30" width="320" height="70" fill="#fde68a" />
      <polygon points="0,30 160,-30 320,30" fill="#b45309" />
      <rect x="130" y="55" width="60" height="45" fill="#92400e" />
    </g>

    {/* curb / street */}
    <rect x="0" y="440" width="640" height="14" fill="#9ca3af" />
    <rect x="0" y="454" width="640" height="60" fill="#4b5563" />
    <rect x="20" y="480" width="40" height="6" fill="#f3f4f6" opacity="0.7" />
    <rect x="120" y="480" width="40" height="6" fill="#f3f4f6" opacity="0.7" />
    <rect x="480" y="480" width="40" height="6" fill="#f3f4f6" opacity="0.7" />
    <rect x="580" y="480" width="40" height="6" fill="#f3f4f6" opacity="0.7" />

    {/* tree, top-left */}
    <g transform="translate(70,150)">
      <rect x="14" y="55" width="12" height="35" fill="#78350f" />
      <circle cx="20" cy="35" r="34" fill="#22c55e" />
      <circle cx="20" cy="35" r="34" fill="#16a34a" opacity="0.35" />
    </g>

    {/* parked car, top-right */}
    <g transform="translate(470,165)">
      <rect x="0" y="20" width="110" height="34" rx="10" fill="#0f766e" />
      <rect x="18" y="0" width="70" height="26" rx="8" fill="#0f766e" />
      <rect x="24" y="4" width="24" height="16" rx="3" fill="#ccfbf1" />
      <rect x="54" y="4" width="24" height="16" rx="3" fill="#ccfbf1" />
      <circle cx="22" cy="56" r="11" fill="#111827" />
      <circle cx="88" cy="56" r="11" fill="#111827" />
    </g>

    {/* neighbor bin, left */}
    <g transform="translate(95,330)">
      <rect x="0" y="14" width="44" height="66" rx="6" fill="#94a3b8" />
      <rect x="-4" y="4" width="52" height="14" rx="4" fill="#64748b" />
    </g>

    {/* mailbox, right */}
    <g transform="translate(500,340)">
      <rect x="14" y="30" width="8" height="45" fill="#6b7280" />
      <rect x="0" y="6" width="42" height="26" rx="13" fill="#1d4ed8" />
      <rect x="30" y="14" width="10" height="10" fill="#bfdbfe" />
    </g>

    {/* main bin, center on curb */}
    <g transform="translate(288,368)">
      <ellipse cx="32" cy="76" rx="30" ry="7" fill="#00000022" />
      <rect x="4" y="10" width="56" height="66" rx="8" fill="#16a34a" />
      <rect x="4" y="10" width="56" height="66" rx="8" fill="#000000" opacity="0.06" />
      <rect x="-2" y="0" width="68" height="16" rx="6" fill="#14532d" />
      <circle cx="14" cy="80" r="7" fill="#111827" />
      <circle cx="50" cy="80" r="7" fill="#111827" />
      <rect x="26" y="-2" width="12" height="8" rx="2" fill="#14532d" />
    </g>
    <text x="320" y="472" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f9fafb" fontFamily="Montserrat, sans-serif">
      WHEELS TOWARD HOUSE · HANDLE OUT
    </text>

    {/* measurements */}
    <Measurement x1="320" y1="360" x2="320" y2="215" label="5 ft from cars and trees" labelX="320" labelY="200" />
    <Measurement x1="270" y1="400" x2="150" y2="365" label="3 ft from other bins" labelX="95" labelY="310" anchor="start" />
    <Measurement x1="365" y1="400" x2="495" y2="375" label="3 ft from mailbox" labelX="615" labelY="310" anchor="end" />
  </svg>
);

export default TrashCanDiagram;
