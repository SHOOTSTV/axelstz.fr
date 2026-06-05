import { portfolio } from "@/data/portfolio";
import { Shell } from "@/components/Profile";

export default function Page() {
  return <Shell data={portfolio} github={null} />;
}
