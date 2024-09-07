// src/app/providers.tsx

'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { WalletConnectionProvider } from '../components/WalletConnectionProvider'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null  // or return a loading placeholder
  }

  return (
    <ChakraProvider>
      <WalletConnectionProvider>
        {children}
      </WalletConnectionProvider>
    </ChakraProvider>
  )
}