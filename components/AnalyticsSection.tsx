'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { SectionContainer } from './SectionContainer'
import { GlassCard } from './GlassCard'
import { AnimatedHeading } from './AnimatedHeading'

const revenueData = [
  { month: 'Jan', revenue: 24 },
  { month: 'Feb', revenue: 32 },
  { month: 'Mar', revenue: 28 },
  { month: 'Apr', revenue: 45 },
  { month: 'May', revenue: 52 },
  { month: 'Jun', revenue: 68 },
]

const jobsData = [
  { month: 'Week 1', jobs: 12 },
  { month: 'Week 2', jobs: 18 },
  { month: 'Week 3', jobs: 22 },
  { month: 'Week 4', jobs: 28 },
  { month: 'Week 5', jobs: 32 },
  { month: 'Week 6', jobs: 38 },
]

const accuracyData = [
  { name: 'Perfect', value: 85, color: '#10b981' },
  { name: 'Good', value: 12, color: '#3b82f6' },
  { name: 'Fair', value: 2, color: '#f59e0b' },
  { name: 'Review', value: 1, color: '#ef4444' },
]

export function AnalyticsSection() {
  return (
    <SectionContainer id="analytics">
      <div className="flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <AnimatedHeading>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Real-time Analytics
            </h2>
          </AnimatedHeading>
          <AnimatedHeading delay={0.1}>
            <p className="text-lg text-gray-400">
              Gain deep insights into your operations with comprehensive analytics
            </p>
          </AnimatedHeading>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="lg" className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Monthly Revenue</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                      }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Jobs Completed Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="lg" className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Jobs Completed</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                      }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Bar dataKey="jobs" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Accuracy Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="lg" className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Detection Accuracy</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accuracyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {accuracyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                      }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="lg" className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Key Metrics</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Avg Processing Time', value: '2.3 sec', icon: '⚡' },
                    { label: 'Items Per Job', value: '450', icon: '📦' },
                    { label: 'Cost Savings', value: '34%', icon: '💰' },
                    { label: 'Customer Satisfaction', value: '4.9/5', icon: '⭐' },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-2">
                        <span className="text-xl">{metric.icon}</span>
                        {metric.label}
                      </span>
                      <span className="font-bold text-white">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  )
}
