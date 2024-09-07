// src/components/Navbar.tsx

'use client'

import { Box, Flex, Button, useColorModeValue  } from '@chakra-ui/react'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

const Navbar = () => {
  const bgColor = useColorModeValue('white', 'gray.800')

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Box bg={bgColor} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold">Coconut</Box>
        <Flex alignItems="center">
          <Link href="/" passHref>
            <Button as="a" variant="ghost" mr={3}>Home</Button>
          </Link>
          <Link href="/invest" passHref>
            <Button as="a" variant="ghost" mr={3}>Invest</Button>
          </Link>
          <Link href="/book-room" passHref>
            <Button as="a" variant="ghost" mr={3}>Book Room</Button>
          </Link>
          <Link href="/distribute-profits" passHref>
            <Button as="a" variant="ghost" mr={3}>Distribute Profits</Button>
          </Link>
          <WalletMultiButton />
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar