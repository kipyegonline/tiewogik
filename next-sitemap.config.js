/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://tiewogik.com',
  generateRobotsTxt: true,
  // (optional)
  // exclude: ['/server-sitemap.xml'], // <= exclude here
  // robotsTxtOptions: {
  //   additionalSitemaps: [
  //     'https://tiewogik.com/server-sitemap.xml', // <== [optional]
  //   ],
  // },
}
