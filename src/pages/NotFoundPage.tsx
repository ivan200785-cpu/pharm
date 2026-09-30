import { Link } from "react-router-dom";
import { EmptyState } from "@/components/StateViews";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return <EmptyState title="Страница не найдена" action={<Button asChild variant="outline"><Link to="/">На главную</Link></Button>} />;
}
