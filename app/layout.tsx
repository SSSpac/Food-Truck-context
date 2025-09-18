'use client'
import { UserContextProvider } from '@/utils/contexts'
import Navigation from '../app/components/Navigation/Navigation'
import Header from '../app/components/Header/header'
import LogInWrapper from '../app/components/LogInWrapper/LogInWrapper'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserContextProvider>
                      <Header />

          <LogInWrapper>
            <Navigation />
            <main>{children}</main>
          </LogInWrapper>
        </UserContextProvider>
      </body>
    </html>
  )
}