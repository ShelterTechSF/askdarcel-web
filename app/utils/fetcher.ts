interface Headers {
  [key: string]: string;
}

export default async function fetcher<T>(
  url: string,
  headers: Headers = {}
): Promise<T> {
  const fetchHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const res = await fetch(url, {
    headers: fetchHeaders,
  });
  return res.json();
}
