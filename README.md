# remark-plugin-oembed

A Remark plugin to add rich content to Markdown.

## What it does

If you're not familiar with [oEmbed](https://oembed.com/), here's a description from their site:

> oEmbed is a format for allowing an embedded representation of a URL on third party sites. The simple API allows a website to display embedded content (such as photos or videos) when a user posts a link to that resource, without having to parse the resource directly.

This plugin scans your content for URLs that match any of the supported [providers](https://github.com/ndaidong/oembed-parser/blob/v2.0.3/src/utils/providers.json) in [oembed-parser](https://www.npmjs.com/package/oembed-parser), and converts them into their rich representation (html, video, or photo).

Since there are dozens of supported providers I didn't test that all of them rendered well, but I did test a few popular ones:

- Twitter
- YouTube
- Vimeo
- Pinterest
- MixCloud
- Kickstarter
- Gfycat
- Flickr
- CodeSandbox

## Styling

This plugin is intentionally basic, and doesn't add a whole lot of extra styling to rendered content beyond basic sizing and responsiveness. There are HTML attributes you can write styles for, though. The following attributes exist on all embed container elements:

- `class="oembed-container"` the container class
- `data-oembed-type="[rich|video|photo]"` the type of embed
- `data-oembed-provider="[provider name]"` the provider name

## Options

You can configure this plugin with a single option:

`providers`: An array of providers you wish to parse URLs for. When left unset it will parse [all supported providers](https://github.com/ndaidong/oembed-parser/blob/v2.0.3/src/utils/providers.json).
