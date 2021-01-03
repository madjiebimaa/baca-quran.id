/* eslint-disable no-unused-vars */
import getRoutes from './build-scripts/getRoutes'
import getSitemaps from './build-scripts/getSitemaps'
import getOfflineAssets from './build-scripts/getOfflineAssets'
import { getJsonLdWebsite } from './utils/jsonld'

const PROD_PATH = 'https://www.baca-quran.id/'
const title =
  "Baca Al-Qur'an dari browser | Baca-Quran.id"
const description = "Ayat-ayat Al-Qur'an beserta terjemahan dan tafsir dari Kemenag, ❌ tanpa ada iklan, ❌ tanpa ada analitik, ✅ gratis sepenuhnya"

const config = {
  env: {
    baseUrl: PROD_PATH,
    envBuildTime: new Date().toISOString()
  },
  buildModules: ['@nuxt/typescript-build'],
  target: 'static',
  router: {
    prefetchLinks: false
  },
  /*
   ** Headers of the page
   */
  head: {
    title,
    meta: [
      { hid: 'description', name: 'description', content: description },
      { hid: 'theme-color', name: 'theme-color', content: '#f6f7f8' },

      { hid: 'og:site_name', property: 'og:site_name', content: title },
      { hid: 'og:image', property: 'og:image', content: '/meta-image.png' },
      { hid: 'og:title', property: 'og:title', content: title },
      { hid: 'og:description', property: 'og:description', content: description },
      { hid: 'og:url', property: 'og:url', content: PROD_PATH },

      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:image:src', name: 'twitter:image:src', content: '/meta-image.png' },
      { hid: 'twitter:title', name: 'twitter:title', content: title },
      { hid: 'twitter:description', name: 'twitter:description', content: description },
      { hid: 'twitter:url', name: 'twitter:url', content: PROD_PATH },
      { hid: 'twitter:creator', name: 'twitter:creator', content: '@maz_ipan' },

      { hid: 'article:published_time', name: 'article:published_time', content: new Date().toISOString() },
      { hid: 'article:publisher', name: 'article:publisher', content: 'https://www.facebook.com/mazipanneh' },
      { hid: 'article:author', name: 'article:author', content: 'https://www.facebook.com/mazipanneh' },
      { hid: 'article:tag', name: 'article:tag', content: 'quran web' }
    ],
    noscript: [
      {
        innerHTML: 'This website requires JavaScript.',
        body: true
      }
    ],
    script: [
      {
        hid: 'ld-website',
        innerHTML: JSON.stringify(getJsonLdWebsite()),
        type: 'application/ld+json',
        body: true
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  manifest: {
    name: 'Baca-Quran.id',
    short_name: 'Quran',
    description,
    theme_color: '#f6f7f8',
    background_color: '#f6f7f8',
    lang: 'id',
    display: 'standalone'
  },
  workbox: {
    cacheNames: {
      prefix: 'baca-quran'
    },
    cleanupOutdatedCaches: true,
    offline: true,
    offlineStrategy: 'CacheFirst',
    preCaching: getOfflineAssets(),
    runtimeCaching: [
      {
        urlPattern: '^https://www.baca-quran.id/.*\\.(js|css)$',
        handler: 'CacheFirst',
        strategyOptions: {
          cacheName: 'js-css'
        },
        strategyPlugins: [{
          use: 'Expiration',
          config: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 30
          }
        }, {
          use: 'CacheableResponse',
          config: {
            statuses: [200]
          }
        }]
      },
      {
        urlPattern: '^https://www.baca-quran.id/.*\\.(jpg|png|bmp|jpeg|svg|webp|gif|ttf|woff)$',
        handler: 'CacheFirst',
        strategyOptions: {
          cacheName: 'assets'
        },
        strategyPlugins: [{
          use: 'Expiration',
          config: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 365
          }
        }, {
          use: 'CacheableResponse',
          config: {
            statuses: [200]
          }
        }]
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#f00',
    height: '3px',
    continuous: true
  },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/vue-carousel', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '~/modules/ampify',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    '~/modules/copyStaticHtml'
  ],

  sitemap: {
    hostname: PROD_PATH,
    cacheTime: 1000 * 60 * 60,
    lastmod: new Date(),
    path: 'sitemaps.xml',
    sitemaps: getSitemaps()
  },
  /*
   ** Generate multiple entry html from 1 to 114
   */
  generate: {
    crawler: false,
    fallback: true,
    concurrency: 50,
    routes: getRoutes()
  },
  /*
   ** Build configuration
   */
  build: {
    // babel: {
    //   plugins: ['transform-decorators-legacy', 'transform-class-properties']
    // },
    parallel: true,
    optimizeCSS: true,
    publicPath: PROD_PATH,
    quiet: false,
    postcss: {
      preset: {
        autoprefixer: {
          grid: true
        }
      }
    }
  }
}

export default config
