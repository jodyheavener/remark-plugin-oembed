import type { Link, Root } from 'mdast';
import {
  extract,
  findProvider,
  PhotoTypeData,
  RichTypeData,
} from 'oembed-parser';
import providers from 'oembed-parser/src/utils/providers.orginal.json';
import type { Plugin, Transformer } from 'unified';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';
import styles from './styles';

interface PluginOptions {
  providers: string[];
}

const normalize = (value: string) => value.toLowerCase().replace(/\s/g, '-');

const allProviders = providers.map((provider) =>
  normalize(provider.provider_name)
);

const defaultOptions: PluginOptions = {
  providers: allProviders,
};

let styleKeys: string[] = [];

const isPermittedEmbed = (url: string, providers: string[]) => {
  const provider = findProvider(url);
  if (!provider) {
    return false;
  }
  return providers.includes(normalize(provider.providerName));
};

const isValidUrl = (value: string) => {
  let url;
  try {
    url = new URL(value);
  } catch (_) {
    return false;
  }
  return ['http:', 'https:'].includes(url.protocol);
};

const isEmbedUrl = (node: Node, providers: string[]): node is Link =>
  node.type === 'link' &&
  isValidUrl((node as Link).url) &&
  isPermittedEmbed((node as Link).url, providers);

const getOembed = async (node: Link) => {
  try {
    const oembed = await extract(node.url);
    return oembed;
  } catch (err) {
    console.trace(err);
    return null;
  }
};

const transformNode = async (node: Link) => {
  const oembed = await getOembed(node);
  // Don't transform links right now
  if (!oembed || oembed.type === 'link') {
    return;
  }

  const providerName = oembed.provider_name
    ? normalize(oembed.provider_name)
    : 'generic-provider';

  const providerStyleKeys = [];
  switch (providerName) {
    case 'youtube':
    case 'vimeo':
    case 'kickstarter':
      providerStyleKeys.push('video-aspect');
      break;
    case 'pinterest':
    case 'codesandbox':
      providerStyleKeys.push('max-width-frame');
      break;
  }

  for (const key of providerStyleKeys) {
    if (!styleKeys.includes(key)) {
      styleKeys.push(key);
    }
  }

  let innerHtml = '';
  switch (oembed.type) {
    case 'rich':
    case 'video':
      innerHtml = (oembed as RichTypeData).html;
      break;
    case 'photo':
      innerHtml = `<img
          src="${(oembed as PhotoTypeData).url}"
          alt="${(oembed as PhotoTypeData).title}"
        />`;
      break;
  }

  Object.assign(node, {
    type: 'html',
    value: `<div
        class="oembed-container ${providerStyleKeys.join(' ')}"
        data-oembed-type="${oembed.type}"
        data-oembed-provider="${providerName}"
      >
          ${innerHtml}
      </div>`,
  });
};

const plugin: Plugin<[PluginOptions?]> = ({ providers } = defaultOptions) => {
  if (
    providers.some((provider) => !allProviders.includes(normalize(provider)))
  ) {
    throw new Error('Invalid oEmbed provider set in plugin options');
  }

  styleKeys = [];

  const transformer: Transformer = async (root) => {
    const nodes: Link[] = [];

    visit(root, (node: Node) => {
      if (isEmbedUrl(node, providers)) {
        nodes.push(node);
      }
    });

    await Promise.all(nodes.map(transformNode));

    (root as Root).children.push({
      type: 'html',
      value: `<style>
        ${styleKeys.map((key) => styles[key]).join('')}
      </style>`,
    });

    return root;
  };

  return transformer;
};

export = plugin;
