import { z } from "zod";

export const favoriteSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["artist", "album", "track"]),
  note: z.string().max(200).optional(),
});

export type FavoriteFormData = z.infer<typeof favoriteSchema>;
