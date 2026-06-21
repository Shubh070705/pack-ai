'use client'

import { motion } from 'framer-motion'
import { SectionContainer } from './SectionContainer'
import { GlassCard } from './GlassCard'
import { AnimatedHeading } from './AnimatedHeading'
import { FileText, Download, TrendingUp } from 'lucide-react'

const reports = [
  {
    title: 'Monthly Operations Report',
    date: 'Generated: June 15, 2024',
    size: '2.4 MB',
    icon: TrendingUp,
    color: 'from-blue-500',
  },
  {
    title: 'Quarterly Analytics Summary',
    date: 'Generated: June 1, 2024',
    size: '3.1 MB',
    icon: FileText,
    color: 'from-purple-500',
  },
  {
    title: 'Customer Success Stories',
    date: 'Generated: May 28, 2024',
    size: '1.8 MB',
    icon: TrendingUp,
    color: 'from-green-500',
  },
  {
    title: 'System Accuracy Benchmarks',
    date: 'Generated: May 15, 2024',
    size: '2.9 MB',
    icon: FileText,
    color: 'from-orange-500',
  },
]

export function ReportsSection() {
  return (
    <SectionContainer id="reports">
      <div className="flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <AnimatedHeading>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Reports & Documentation
            </h2>
          </AnimatedHeading>
          <AnimatedHeading delay={0.1}>
            <p className="text-lg text-gray-400">
              Access detailed reports and insights on your business operations
            </p>
          </AnimatedHeading>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {reports.map((report, i) => {
            const Icon = report.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <GlassCard className="h-full hover:glass-lg transition-all duration-300 flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${report.color}/20 to-transparent`}
                    >
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                      PDF
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{report.date}</p>
                    <p className="text-xs text-gray-500">Size: {report.size}</p>
                  </div>

                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-blue-300 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/20 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </motion.button>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
