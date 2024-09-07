// src/components/DistributeProfitsComponent.tsx

'use client'
import { useState } from 'react'
import { VStack, Button, useToast, Text, Box, Heading, Flex, Icon, Image, useColorModeValue } from '@chakra-ui/react'
import { useProgram } from '../utils/useProgram'
import { useWallet } from '@solana/wallet-adapter-react'
import { web3 } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { FaMoneyBillWave } from 'react-icons/fa'

const HOTEL_ADDRESS = new web3.PublicKey('Gtyw71Lp2Mtb4p6jbgqDXyYsg8iPoBh4pwxQvk8vPc3t')
const USDC_VAULT = new web3.PublicKey('Fh7CFQwTfXcxAqXP5VB9Mo8jJk57ny7TTiW1v5CKM9ai')
const USDC_MINT = new web3.PublicKey('8ParW5xmcR9D59DKNpsnixQvYeWH82NUa5Zi4cs3B1AE')

export const DistributeProfitsComponent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const program = useProgram()
  const { publicKey } = useWallet()
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.200')

  const distributeProfits = async () => {
    if (!program || !publicKey) {
      toast({
        title: "Error",
        description: "Wallet not connected or program not initialized",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      const tx = await program.methods
        .distributeProfits()
        .accounts({
          authority: publicKey,
          hotel: HOTEL_ADDRESS,
          usdcVault: USDC_VAULT,
          usdcMint: USDC_MINT,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()
      
      toast({
        title: "Profits distributed successfully",
        description: `Transaction ID: ${tx}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Distribution error:", error)
      toast({
        title: "Distribution failed",
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
            <Icon as={FaMoneyBillWave} w={8} h={8} color="purple.500" mr={3} />
            <Heading size="xl" textAlign="center">Distribute Profits</Heading>
          </Flex>
          <Text color={textColor} fontSize="lg" textAlign="center">
            Distribute profits to all investors of Coconut Hotel
          </Text>
          <Button 
            onClick={distributeProfits} 
            colorScheme="purple" 
            size="lg"
            isDisabled={!program || !publicKey || isLoading}
            isLoading={isLoading}
            loadingText="Distributing..."
            leftIcon={<FaMoneyBillWave />}
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            Distribute Profits
          </Button>
          {!publicKey && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              Please connect your wallet to distribute profits
            </Text>
          )}
          <Text fontSize="sm" color={textColor} textAlign="center">
            Share the success of Coconut Hotel with our valued investors. This action will distribute accumulated profits to all token holders.
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}