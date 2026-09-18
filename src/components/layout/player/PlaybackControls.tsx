import { useTranslation } from "@/modules";
import { Slider } from "@/components/ui/slider";
import {
  ShuffleIcon,
  PrevIcon,
  PlayIcon,
  PauseIcon,
  NextIcon,
  RepeatIcon,
} from "@/components/icons/player";
import { formatDuration } from "@/utils";

function getNextRepeatState(current: string): "off" | "context" | "track" {
  if (current === "off") return "context";
  if (current === "context") return "track";
  return "off";
}

interface PlaybackControlsProps {
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  shuffleState: boolean;
  repeatState: string;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: (state: boolean) => void;
  onRepeat: (state: "off" | "context" | "track") => void;
  onSeek: (positionMs: number) => void;
}

export function PlaybackControls({
  isPlaying,
  progressMs,
  durationMs,
  shuffleState,
  repeatState,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  onSeek,
}: Readonly<PlaybackControlsProps>) {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-col items-center w-2/5"
      style={{ marginTop: 5, marginBottom: -5 }}
    >
      <div className="flex items-center gap-6 mb-1">
        <button
          onClick={() => onShuffle(!shuffleState)}
          aria-label={t("COMPONENTS.PLAYER.shuffle")}
        >
          <ShuffleIcon active={shuffleState} />
        </button>
        <button
          onClick={onPrevious}
          aria-label={t("COMPONENTS.PLAYER.previous")}
        >
          <PrevIcon />
        </button>
        <button
          onClick={onPlayPause}
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={
            isPlaying
              ? t("COMPONENTS.PLAYER.pause")
              : t("COMPONENTS.PLAYER.play")
          }
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={onNext} aria-label={t("COMPONENTS.PLAYER.next")}>
          <NextIcon />
        </button>
        <button
          onClick={() => onRepeat(getNextRepeatState(repeatState))}
          aria-label={t("COMPONENTS.PLAYER.repeat")}
        >
          <RepeatIcon state={repeatState} />
        </button>
      </div>

      <div className="flex items-center justify-between w-full">
        <span className="text-text mr-2 text-xs tabular-nums">
          {formatDuration(progressMs)}
        </span>
        <Slider
          value={[progressMs]}
          max={durationMs || 1}
          step={1000}
          onValueCommitted={(value) =>
            onSeek(Array.isArray(value) ? value[0] : (value as number))
          }
          className="flex-1"
          aria-label={t("COMPONENTS.PLAYER.trackProgress")}
        />
        <span className="text-text ml-2 text-xs tabular-nums">
          {formatDuration(durationMs)}
        </span>
      </div>
    </div>
  );
}
