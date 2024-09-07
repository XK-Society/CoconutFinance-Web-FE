// src/components/InvestComponent.tsx

'use client'
import { useState } from 'react'
import { VStack, Input, Button, useToast, Text, Box, Heading, Flex, Icon, Image, useColorModeValue } from '@chakra-ui/react'
import { useHotelCoconutProgram } from '../app/hooks/useHotelCoconutProgram'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { BN } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { FaDollarSign, FaHotel } from 'react-icons/fa'

const HOTEL_ADDRESS = new PublicKey('Gtyw71Lp2Mtb4p6jbgqDXyYsg8iPoBh4pwxQvk8vPc3t')
const USDC_VAULT = new PublicKey('Fh7CFQwTfXcxAqXP5VB9Mo8jJk57ny7TTiW1v5CKM9ai')
const USDC_MINT = new PublicKey('8ParW5xmcR9D59DKNpsnixQvYeWH82NUa5Zi4cs3B1AE')
const HOTEL_TOKEN_MINT = new PublicKey('GtmZHRBs1ZKkVMUvGuW3kZYACoeXzMQPvQPc6VaEwqDW')

export const InvestComponent = () => {
  const [amount, setAmount] = useState('')
  const programInstance = useHotelCoconutProgram()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.200')

  const invest = async () => {
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
      const investorHotelTokenAccount = await getAssociatedTokenAddress(
        HOTEL_TOKEN_MINT,
        publicKey
      )

      const investorUsdcAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      )

      let transaction = new Transaction()

      if (programInstance) {
        transaction = await programInstance.methods
          .invest(new BN(parseFloat(amount) * 1e6))
          .accounts({
            hotel: HOTEL_ADDRESS,
            investor: publicKey,
            investorUsdcAccount: investorUsdcAccount,
            investorHotelTokenAccount: investorHotelTokenAccount,
            hotelTokenMint: HOTEL_TOKEN_MINT,
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
        title: "Investment successful",
        description: `Transaction ID: ${signature}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      
      setAmount('')
    } catch (error) {
      console.error("Investment error:", error)
      toast({
        title: "Investment failed",
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
            <Icon as={FaHotel} w={8} h={8} color="blue.500" mr={3} />
            <Heading size="xl" textAlign="center"></Heading>
          </Flex>
          <Text color={textColor} fontSize="lg" textAlign="center">
            Be part of this luxurious beach resort investment opportunity
          </Text>
          <Input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Amount to invest (USDC)"
            size="lg"
            borderWidth={2}
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
          />
          <Button 
            onClick={invest} 
            colorScheme="blue" 
            size="lg"
            isDisabled={!publicKey || !amount || isLoading}
            isLoading={isLoading}
            loadingText="Investing..."
            leftIcon={<FaDollarSign />}
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            Invest Now
          </Button>
          {!publicKey && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              Please connect your wallet to invest
            </Text>
          )}
          <Text fontSize="sm" color={textColor} textAlign="center">
            Join our exclusive community of investors and enjoy the benefits of owning a piece of paradise.
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}