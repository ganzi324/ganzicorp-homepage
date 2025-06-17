import Link from 'next/link'
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: '회사소개', href: '/about' },
      { name: '서비스', href: '/services' },
      { name: '채용정보', href: '/careers' },
      { name: '파트너십', href: '/partnership' },
    ],
    support: [
      { name: '고객지원', href: '/support' },
      { name: '문의하기', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: '공지사항', href: '/notices' },
    ],
    legal: [
      { name: '이용약관', href: '/terms' },
      { name: '개인정보처리방침', href: '/privacy' },
      { name: '쿠키정책', href: '/cookies' },
      { name: '법적고지', href: '/legal' },
    ],
  }

  const contactInfo = [
    { icon: Phone, text: '+82-2-1234-5678', href: 'tel:+82-2-1234-5678' },
    { icon: Mail, text: 'contact@ganzicorp.com', href: 'mailto:contact@ganzicorp.com' },
    { icon: MapPin, text: '서울특별시 강남구 테헤란로 123', href: '#' },
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/ganzicorp', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/ganzicorp', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/ganzicorp', label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold">GanziCorp</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              혁신적인 기술 솔루션으로 비즈니스의 성장을 돕는 
              전문 기술 서비스 회사입니다.
            </p>
            <div className="space-y-2">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? (
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 회사 링크 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">회사</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 지원 링크 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">지원</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 법적 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">법적 정보</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 구분선 및 소셜 링크 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} GanziCorp. All rights reserved.
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 