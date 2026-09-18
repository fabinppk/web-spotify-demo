import { useTranslation } from "@/modules";
import { useCurrentUserProfile } from "@/hooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Profile() {
  const { t } = useTranslation();
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useCurrentUserProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <Skeleton className="w-36 h-36 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={t("PAGES.PROFILE.title")}
        onRetry={() => refetch()}
      />
    );
  }

  if (!profile) return null;

  const avatarUrl = profile.images?.[0]?.url;
  const initials = profile.display_name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const followersCount = profile.followers?.total ?? 0;
  const isPremium = profile.product === "premium";

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-lg mx-auto w-full">
      <h1 className="text-3xl font-bold text-text self-start">
        {t("PAGES.PROFILE.title")}
      </h1>

      <Avatar className="w-36 h-36">
        <AvatarImage src={avatarUrl} alt={profile.display_name} />
        <AvatarFallback className="text-3xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-3xl font-bold text-text">{profile.display_name}</p>
        <p className="text-text-muted text-sm">
          {followersCount.toLocaleString()} {t("PAGES.PROFILE.followers")}
        </p>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isPremium
              ? "bg-accent text-bg"
              : "bg-surface text-text-muted border border-border"
          }`}
        >
          {isPremium ? t("PAGES.PROFILE.premium") : t("PAGES.PROFILE.free")}
        </span>
      </div>
    </div>
  );
}
