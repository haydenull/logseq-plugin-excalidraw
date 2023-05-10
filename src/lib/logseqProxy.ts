const fetchLogseqApi = async (method: string, args?: any[]) => {
  console.warn("=== Proxy call to logseq: ", method);
  const res = await fetch(`${import.meta.env.VITE_LOGSEQ_API_SERVER}/api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_LOGSEQ_API_TOKEN}`,
    },
    body: JSON.stringify({
      method,
      args,
    }),
  });
  return res.json();
};

const LOGSEQ_METHODS_OBJECT = [
  "App",
  "Editor",
  "DB",
  "Git",
  "UI",
  "Assets",
  "FileStorage",
] as const;
const proxyLogseqMethodsObject = (
  key: (typeof LOGSEQ_METHODS_OBJECT)[number]
) => {
  const proxy = new Proxy(
    {},
    {
      get(target, propKey) {
        return async (...args: any[]) => {
          return fetchLogseqApi(`logseq.${key}.${propKey.toString()}`, args);
        };
      },
    }
  );
  // @ts-ignore
  window.logseq[key] = proxy;
};
export const proxyLogseq = () => {
  // @ts-ignore
  // window.logseqBack = window.logseq;
  // @ts-ignore
  window.logseq = {};
  LOGSEQ_METHODS_OBJECT.forEach(proxyLogseqMethodsObject);
};
