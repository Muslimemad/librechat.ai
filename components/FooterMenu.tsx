import Link from 'next/link'
import { Github, Linkedin, Youtube, Mail } from 'lucide-react'
import Discord from './icons/discord'
import X from './icons/x'

const menuItems: {
  heading: string
  items: { name: string; href: string }[]
}[] = [
  {
    heading: 'Platform',
    items: [
      { name: 'About', href: '/about' },
      { name: 'Contact Us', href: '/about#contact-us' },
      { name: 'Features', href: '/docs/features' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { name: 'Changelog', href: '/changelog' },
      { name: 'Roadmap', href: '/blog' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    heading: 'Documentation',
    items: [
      { name: 'Get Started', href: '/docs' },
      { name: 'Quick Start', href: '/docs/quick_start' },
      { name: 'Local Install', href: '/docs/local' },
      { name: 'Remote Install', href: '/docs/remote' },
    ],
  },
  {
    heading: 'Features',
    items: [
      { name: 'Portfolio AI', href: '/docs/features/portfolio' },
      { name: 'Market Research', href: '/docs/features/market-research' },
      { name: 'AI Agents', href: '/docs/features/agents' },
      { name: 'Risk Analysis', href: '/docs/features/risk' },
    ],
  },
  {
    heading: 'Newsletter',
    items: [
      { name: 'Subscribe', href: '/subscribe' },
      { name: 'Unsubscribe', href: '/unsubscribe' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { name: 'Terms of Service', href: '/tos' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookie' },
    ],
  },
]

const socialLinks = [
  {
    title: 'GitHub',
    icon: <Github className="size-4" aria-hidden="true" />,
    href: 'https://github.com/muslimemad/wealthcreators-ai',
  },
  {
    title: 'Discord',
    icon: <Discord className="size-4" aria-hidden="true" />,
    href: '#',
  },
  {
    title: 'LinkedIn',
    icon: <Linkedin className="size-4" aria-hidden="true" />,
    href: '#',
  },
  {
    title: 'X',
    icon: <X className="size-4" aria-hidden="true" />,
    href: '#',
  },
  {
    title: 'YouTube',
    icon: <Youtube className="size-4" aria-hidden="true" />,
    href: '#',
  },
  {
    title: 'Email',
    icon: <Mail className="size-4" aria-hidden="true" />,
    href: 'mailto:contact@wealthcreators.ai',
  },
]

/** Site footer with navigation link columns and social media icon links. */
const FooterMenu = () => {
  return (
    <footer className="w-full" role="contentinfo">
      <nav
        aria-label="Footer"
        className="grid grid-cols-2 md:grid-cols-6 text-base gap-y-8 gap-x-2"
      >
        {menuItems.map((menu) => (
          <div key={menu.heading}>
            <p className="pb-2 font-mono font-bold text-primary">{menu.heading}</p>
            <ul className="flex flex-col gap-2">
              {menu.items.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm leading-tight hover:text-primary/80">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="flex items-center justify-between mt-8">
        <div className="font-sans text-sm">&copy; {new Date().getFullYear()} WealthCreators AI</div>
        <nav aria-label="Social media" className="flex items-center gap-1">
          {socialLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              aria-label={link.title}
              className="flex items-center justify-center size-9 rounded-full text-neutral-500 dark:text-neutral-300 transition-colors duration-200 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {link.icon}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default FooterMenu
