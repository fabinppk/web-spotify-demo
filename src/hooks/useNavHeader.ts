import { useState } from "react";

export function useNavHeader() {
  const [activeFilter, setActiveFilter] = useState<FilterChip>("All");
  return { activeFilter, setActiveFilter };
}
