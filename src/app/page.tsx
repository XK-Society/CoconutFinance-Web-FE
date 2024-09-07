'use client'
import { Box, Heading, Text, Button, VStack, Container, Flex, Image, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'
import { FaCoins, FaBed, FaMoneyBillWave } from 'react-icons/fa'

export default function Home() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.200')
  const headingColor = useColorModeValue('blue.600', 'blue.300')

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={20}>
        <Flex direction={{ base: "column", lg: "row" }} align="center" justify="space-between">
          <VStack spacing={8} align="flex-start" maxW="lg">
            <Heading as="h1" size="2xl" color={headingColor}>
              Welcome to Coconut
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Experience the future of decentralized hospitality. Invest, book, and share profits in our blockchain-powered paradise.
            </Text>
            <Flex wrap="wrap" gap={4}>
              <Link href="/invest" passHref>
                <Button as="a" colorScheme="blue" size="lg" leftIcon={<FaCoins />}>Invest Now</Button>
              </Link>
              <Link href="/book-room" passHref>
                <Button as="a" colorScheme="green" size="lg" leftIcon={<FaBed />}>Book a Room</Button>
              </Link>
              <Link href="/distribute-profits" passHref>
                <Button as="a" colorScheme="purple" size="lg" leftIcon={<FaMoneyBillWave />}>Distribute Profits</Button>
              </Link>
            </Flex>
          </VStack>
          <Box mt={{ base: 10, lg: 0 }} ml={{ lg: 10 }}>
            <Image 
              src="/coconut.jpg" 
              alt="Coconut Hotel" 
              borderRadius="lg" 
              boxShadow="2xl" 
              maxW="500px"
              w="100%"
              h="auto"
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}