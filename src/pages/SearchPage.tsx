import { useSearchParams } from "react-router-dom";
import { ExternalSearch } from "@/components/ExternalSearch";
import { SaveQueryButton } from "@/components/SaveQueryButton";
import { SearchBox } from "@/components/SearchBox";
import { EmptyState } from "@/components/StateViews";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim();

  return (
    <div className="space-y-5">
      <SearchBox initial={q} />
      {q ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-semibold">Искать «{q}» в аптеках</h1>
            <SaveQueryButton query={q} />
          </div>
          <ExternalSearch query={q} />
          <p className="text-sm text-muted-foreground">Цены и наличие показывают сами аптеки — откроется их сайт в новой вкладке.</p>
        </>
      ) : (
        <EmptyState title="Введите название лекарства" />
      )}
    </div>
  );
}
