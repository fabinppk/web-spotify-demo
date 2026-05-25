import { useTranslation } from "@/modules";
import { Chip } from "@/components/ui/Chip";

const CHIPS: FilterChip[] = ["All", "Music", "Podcasts"];

export function NavHeader({
  active,
  onChange,
}: Readonly<{
  active: FilterChip;
  onChange: (chip: FilterChip) => void;
}>) {
  const { t } = useTranslation();

  return (
    <div
      role="radiogroup"
      aria-label="Content filter"
      className="sticky top-0 z-10 bg-surface px-4 py-2 mt-4 flex items-center gap-2"
    >
      {CHIPS.map((chip) => (
        <Chip
          key={chip}
          label={t(`COMPONENTS.NAV_HEADER.${chip.toLowerCase()}`)}
          active={active === chip}
          role="radio"
          aria-checked={active === chip}
          tabIndex={active === chip ? 0 : -1}
          onClick={() => onChange(chip)}
        />
      ))}
    </div>
  );
}
