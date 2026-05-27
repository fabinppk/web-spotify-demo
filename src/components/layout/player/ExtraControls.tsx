import { Volume2, VolumeX, useTranslation } from "@/modules";
import { Slider } from "@/components/ui/slider";
import {
  QueueIcon,
  ConnectDevicesIcon,
  LyricsQueueIcon,
} from "@/components/icons/player";

interface ExtraControlsProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
}

export function ExtraControls({
  volume,
  onVolumeChange,
  onMuteToggle,
}: Readonly<ExtraControlsProps>) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1" style={{ flex: "0 0 auto" }}>
      <button
        className="hidden lg:block mx-1"
        aria-label={t("COMPONENTS.PLAYER.queue")}
      >
        <QueueIcon />
      </button>
      <button
        className="mx-1"
        aria-label={t("COMPONENTS.PLAYER.connectDevice")}
      >
        <ConnectDevicesIcon />
      </button>
      <button className="mx-1" aria-label={t("COMPONENTS.PLAYER.queue")}>
        <LyricsQueueIcon />
      </button>

      <div className="flex items-center gap-1 ml-1">
        <button
          onClick={onMuteToggle}
          aria-label={
            volume === 0
              ? t("COMPONENTS.PLAYER.unmute")
              : t("COMPONENTS.PLAYER.mute")
          }
        >
          {volume === 0 ? (
            <VolumeX
              className="w-[17px] h-[17px]"
              style={{ color: "var(--color-text-muted)" }}
            />
          ) : (
            <Volume2
              className="w-[17px] h-[17px]"
              style={{ color: "var(--color-text-muted)" }}
            />
          )}
        </button>
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueCommitted={(value) =>
            onVolumeChange(Array.isArray(value) ? value[0] : (value as number))
          }
          style={{ width: 90 }}
          aria-label={t("COMPONENTS.PLAYER.volume")}
        />
      </div>
    </div>
  );
}
