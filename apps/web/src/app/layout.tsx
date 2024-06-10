import './globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next15/React19 - SaaS RBAC App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="dark">{children}</body>
    </html>
  )
}
