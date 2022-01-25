export default {
  'video-aspect': `
    .video-aspect {
      position: relative;
      padding-top: 56.25%;
    }

    .video-aspect iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `,
  'max-width-frame': `
    .max-width-frame iframe {
      max-width: 100%;
    }
  `,
} as Record<string, string>;
