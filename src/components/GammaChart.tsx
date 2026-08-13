import type { GammaProfile } from '../lib/gammaProfile';

export default function GammaChart({ profile, height = 460 }: { profile: GammaProfile; height?: number }) {
  const { strikes, spot, callWall, putWall } = profile;
  const maxAbs = Math.max(...strikes.map((s) => Math.abs(s.netGamma)), 1);
  const rowH = height / strikes.length;
  const midX = 260;
  const maxBar = 220;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 560 ${height}`} width="100%" style={{ height, minWidth: 480 }}>
        <line x1={midX} y1={0} x2={midX} y2={height} stroke="var(--color-border)" strokeWidth={1} />
        {strikes.map((s, i) => {
          const y = i * rowH;
          const w = (Math.abs(s.netGamma) / maxAbs) * maxBar;
          const isCall = s.netGamma >= 0;
          const isSpotRow = Math.abs(s.strike - spot) < (strikes[1]?.strike - strikes[0]?.strike) / 2;
          const isCallWall = s.strike === callWall.strike;
          const isPutWall = s.strike === putWall.strike;
          return (
            <g key={s.strike}>
              <rect
                x={isCall ? midX : midX - w}
                y={y + rowH * 0.15}
                width={w}
                height={rowH * 0.7}
                fill={isCall ? 'rgba(53,214,138,0.75)' : 'rgba(255,93,93,0.75)'}
                stroke={isCallWall || isPutWall ? (isCallWall ? '#35d68a' : '#ff5d5d') : 'none'}
                strokeWidth={isCallWall || isPutWall ? 2 : 0}
              />
              <text x={midX - maxBar - 12} y={y + rowH * 0.65} textAnchor="end" fontSize={11} fill={isSpotRow ? '#f5b642' : '#7c8797'} fontWeight={isSpotRow ? 700 : 400}>
                {s.strike.toFixed(0)}
              </text>
              {isSpotRow && (
                <>
                  <line x1={0} y1={y + rowH / 2} x2={560} y2={y + rowH / 2} stroke="#f5b642" strokeDasharray="4 3" strokeWidth={1} />
                  <text x={555} y={y - 4} textAnchor="end" fontSize={10} fill="#f5b642">spot ≈ {spot.toFixed(0)}</text>
                </>
              )}
              {isCallWall && (
                w > 60
                  ? <text x={midX + 8} y={y + rowH * 0.65} fontSize={10} fontWeight={700} fill="#04150c">Call Wall</text>
                  : <text x={midX + w + 8} y={y + rowH * 0.65} fontSize={10} fontWeight={700} fill="#35d68a">Call Wall</text>
              )}
              {isPutWall && (
                w > 60
                  ? <text x={midX - 8} y={y + rowH * 0.65} textAnchor="end" fontSize={10} fontWeight={700} fill="#1a0505">Put Wall</text>
                  : <text x={midX - w - 8} y={y + rowH * 0.65} textAnchor="end" fontSize={10} fontWeight={700} fill="#ff5d5d">Put Wall</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
