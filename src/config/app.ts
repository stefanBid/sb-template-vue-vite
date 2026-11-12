/**
 * Public branding of the app: site name, title template, social links.
 * Plain constants bundled into the client — never put secrets here.
 */
export const appConfig = {
  site: {
    name: 'Your Site Name',
    titleTemplate: '%s - Your Website',
  },
  social: {
    email: 'your.email@example.com',
    phone: '+39 123 456 7890',
    githubUrl: 'https://github.com/stefanBid',
    instagramUrl: 'https://www.instagram.com/stefano_bid/',
    linkedinUrl: 'https://www.linkedin.com/in/stefano-biddau/',
  },
} as const
