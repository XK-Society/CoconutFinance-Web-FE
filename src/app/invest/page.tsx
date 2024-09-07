'use client'
import { Box, Heading } from '@chakra-ui/react'
import { InvestComponent } from '../../components/InvestComponent'

export default function InvestPage() {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}></Heading>
      <InvestComponent />
    </Box>
  )
}