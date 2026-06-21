'use client'

export function AnimatedBackground() {
  return (
    <>
      {/* Animated gradient mesh background */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(59, 130, 246, 0.1) 0%, 
              rgba(59, 130, 246, 0.05) 25%,
              rgba(139, 92, 246, 0.05) 50%,
              rgba(59, 130, 246, 0.05) 75%,
              rgba(59, 130, 246, 0.1) 100%)
          `,
          backgroundSize: '200% 200%',
          animation: 'gradient-mesh 15s ease infinite',
        }}
      />

      {/* Glow orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Top left glow */}
        <div
          className="absolute -top-40 -left-40 rounded-full glow-pulse"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Bottom right glow */}
        <div
          className="absolute -bottom-40 -right-40 rounded-full glow-pulse"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
            animationDelay: '2s',
          }}
        />

        {/* Center accent glow */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full glow-pulse"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animationDelay: '4s',
          }}
        />
      </div>
    </>
  )
}
