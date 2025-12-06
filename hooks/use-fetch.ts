import { useState } from "react";
import { toast } from "sonner";

function useFetch<TArgs extends any[], TResult>(
  cb: (...args: TArgs) => Promise<TResult>
) {
  const [data, setData] = useState<TResult | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  const fn = async (...args: TArgs): Promise<TResult | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);

      return response;
    } catch (err: unknown) {
      setError(err);

      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      toast.error(message);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
}

export default useFetch;
