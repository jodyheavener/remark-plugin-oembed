import 'oembed-parser';

declare module 'oembed-parser' {
  export function findProvider(url: string): {
    providerName: string;
    providerUrl: string;
    fetchEndpoint: string;
  } | null;
}
