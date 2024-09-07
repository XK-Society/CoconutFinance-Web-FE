// src/app/distribute-profits/page.tsx

'use client'
import { Box, Heading } from '@chakra-ui/react'
import { DistributeProfitsComponent } from '../../components/DistributeProfitsComponent'

export default function DistributeProfitsPage() {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}></Heading>
      <DistributeProfitsComponent />
    </Box>
  )
}