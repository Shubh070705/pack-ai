'use client'

import { motion } from 'framer-motion'
import { Code2, Share2, MessageSquare, Mail, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-slate-900/20">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Operations?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join hundreds of moving companies already using NEXTGEN to revolutionize their inventory management.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>

        {/* Footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Security', 'Roadmap'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Docs', 'API', 'Support', 'Community'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {['Privacy', 'Terms', 'Cookie Policy', 'Compliance'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 p-0.5">
              <img
                src="/logo.png"
                alt="NEXTGEN logo"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <span className="text-sm text-gray-400">
              © 2026 NEXTGEN
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Share2, label: 'Twitter' },
              { icon: MessageSquare, label: 'LinkedIn' },
              { icon: Code2, label: 'GitHub' },
              { icon: Mail, label: 'Email' },
            ].map((social) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
