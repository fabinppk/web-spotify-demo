import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  useTranslation,
} from "@/modules";

interface TopTracksChartProps {
  tracks: Track[];
}

const ACCENT = "var(--color-accent)";
const ACCENT_MUTED = "var(--color-accent-muted)";

export function TopTracksChart({ tracks }: Readonly<TopTracksChartProps>) {
  const { t } = useTranslation();

  const data = tracks
    .filter((track) => track.popularity != null)
    .slice(0, 10)
    .map((track) => ({
      name: track.name.length > 22 ? track.name.slice(0, 22) + "…" : track.name,
      popularity: track.popularity,
    }));

  if (data.length === 0) return null;

  return (
    <section className="px-6 py-6">
      <h2 className="text-text-primary text-2xl font-bold mb-6">
        {t("PAGES.ARTIST_DETAIL.topTracksChart")}
      </h2>
      <div className="bg-surface rounded-lg p-4">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={160}
              tick={{ fill: "var(--color-text)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text)",
                fontSize: "12px",
              }}
              formatter={(value) => [
                value,
                t("PAGES.ARTIST_DETAIL.popularity"),
              ]}
            />
            <Bar
              dataKey="popularity"
              shape={(props) => {
                const {
                  x,
                  y,
                  width,
                  height,
                  index = 0,
                } = props as {
                  x: number;
                  y: number;
                  width: number;
                  height: number;
                  index?: number;
                };
                return (
                  <rect
                    x={x}
                    y={y}
                    width={Math.max(0, width)}
                    height={height}
                    fill={index === 0 ? ACCENT : ACCENT_MUTED}
                    fillOpacity={1 - index * 0.06}
                    rx={4}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
