'use client'
import { useState } from 'react'
import { VStack, Input, Button, useToast, Text, Box, Heading, Flex, Icon, Image, useColorModeValue } from '@chakra-ui/react'
import { useHotelCoconutProgram } from '../app/hooks/useHotelCoconutProgram'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { BN } from '@project-serum/anchor'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token'
import { FaBed } from 'react-icons/fa'

const HOTEL_ADDRESS = new PublicKey('Gtyw71Lp2Mtb4p6jbgqDXyYsg8iPoBh4pwxQvk8vPc3t')
const USDC_VAULT = new PublicKey('Fh7CFQwTfXcxAqXP5VB9Mo8jJk57ny7TTiW1v5CKM9ai')
const USDC_MINT = new PublicKey('8ParW5xmcR9D59DKNpsnixQvYeWH82NUa5Zi4cs3B1AE')

export const BookRoomComponent = () => {
  const [price, setPrice] = useState('')
  const programInstance = useHotelCoconutProgram()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.200')

  const bookRoom = async () => {
    if (!publicKey) {
      toast({
        title: "Error",
        description: "Wallet not connected",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      const touristUsdcAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      )

      let transaction = new Transaction()

      if (programInstance) {
        transaction = await programInstance.methods
          .bookRoom(new BN(parseFloat(price) * 1e6))
          .accounts({
            hotel: HOTEL_ADDRESS,
            tourist: publicKey,
            touristUsdcAccount: touristUsdcAccount,
            usdcVault: USDC_VAULT,
            usdcMint: USDC_MINT,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .transaction()
      } else {
        console.warn("Program instance not available, using fallback method")
        // Implement fallback method here if needed
      }

      const signature = await sendTransaction(transaction, connection)
      
      await connection.confirmTransaction(signature, 'confirmed')

      toast({
        title: "Room booked successfully",
        description: `Transaction ID: ${signature}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      
      setPrice('')
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box maxW="2xl" mx="auto" mt={10} overflow="hidden" borderRadius="lg" boxShadow="2xl">
      <Image src="/resort.jpg" alt="Coconut Hotel Resort" objectFit="cover" w="full" h="300px" />
      <Box bg={bgColor} p={8}>
        <VStack spacing={6} align="stretch">
          <Flex align="center" justify="center">
            <Icon as={FaBed} w={8} h={8} color="green.500" mr={3} />
            <Heading size="xl" textAlign="center">Book a Room at Coconut</Heading>
          </Flex>
          <Text color={textColor} fontSize="lg" textAlign="center">
            Experience luxury and comfort in our beautiful beach resort
          </Text>
          <Input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Room price (USDC)"
            size="lg"
            borderWidth={2}
            _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px green.500" }}
          />
          <Button 
            onClick={bookRoom} 
            colorScheme="green" 
            size="lg"
            isDisabled={!publicKey || !price || isLoading}
            isLoading={isLoading}
            loadingText="Booking..."
            leftIcon={<FaBed />}
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            Book Now
          </Button>
          {!publicKey && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              Please connect your wallet to book a room
            </Text>
          )}
          <Text fontSize="sm" color={textColor} textAlign="center">
            Secure your stay in paradise with our easy booking process. Enjoy world-class amenities and breathtaking views.
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}