import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { Program, AnchorProvider, Idl } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import idl from '../../src/app/idl/hotel_coconut.json'

type HotelCoconutIdl = {
  address: string;
  metadata: {
    name: string;
    version: string;
    spec: string;
    description: string;
  };
  instructions: any[];
  accounts: any[];
  types: any[];
  errors: any[];
};

export const useProgram = () => {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  if (!wallet) return null

  try {
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
    
    const hotelCoconutIdl = idl as HotelCoconutIdl

    if (!hotelCoconutIdl.address) {
      throw new Error('IDL is missing address')
    }

    const anchorIdl: Idl = {
      version: hotelCoconutIdl.metadata.version,
      name: hotelCoconutIdl.metadata.name,
      instructions: hotelCoconutIdl.instructions,
      accounts: hotelCoconutIdl.accounts,
      types: hotelCoconutIdl.types,
      errors: hotelCoconutIdl.errors,
    }

    return new Program(anchorIdl, new PublicKey(hotelCoconutIdl.address), provider)
  } catch (error) {
    console.error('Failed to create program:', error)
    return null
  }
}