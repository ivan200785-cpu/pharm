import { useCallback, useEffect, useState } from "react";

interface AsyncState<T> { data: T | null; loading: boolean; error: string | null }

/** Мини-хук для загрузки данных с loading/error и повторной попыткой. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false; // защита от гонок при смене deps/размонтировании
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((e: unknown) =>
        !cancelled && setState({ data: null, loading: false, error: e instanceof Error ? e.message : "Не удалось загрузить данные" }),
      );
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { ...state, retry };
}
