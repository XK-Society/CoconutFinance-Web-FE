// src/app/book-room/page.tsx

'use client'
import { Box, Heading } from '@chakra-ui/react'
import { BookRoomComponent } from '../../components/BookRoomComponent'

export default function BookRoomPage() {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}></Heading>
      <BookRoomComponent />
    </Box>
  )
}