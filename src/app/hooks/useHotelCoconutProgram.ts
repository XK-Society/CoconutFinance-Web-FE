import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../../../src/app/idl/hotel_coconut.json';

interface HotelCoconutIdl extends Idl {
  metadata?: {
    address: string;
  };
}

type HotelCoconutProgram = Program<HotelCoconutIdl>;

const PROGRAM_ID = '9bVeNhvzziFz7shQNKvq7vkjFfhqvpRqACQPNSmi4Q6g';

function preprocessIdlType(type: any): any {
  if (type === 'publicKey') {
    return { kind: 'struct', fields: [] };
  }
  if (typeof type === 'object' && type !== null) {
    if ('vec' in type) {
      return { vec: preprocessIdlType(type.vec) };
    }
    if ('option' in type) {
      return { option: preprocessIdlType(type.option) };
    }
    if ('array' in type) {
      return { array: [preprocessIdlType(type.array[0]), type.array[1]] };
    }
    if ('defined' in type) {
      return type;
    }
  }
  return type;
}

function preprocessIdlAccount(account: any): any {
  if (typeof account !== 'object' || account === null) {
    return account;
  }
  return {
    ...account,
    type: {
      kind: 'struct',
      fields: (account.type?.fields || []).map((field: any) => ({
        ...field,
        type: preprocessIdlType(field.type)
      }))
    }
  };
}

function ensureIdlStructure(idl: any): HotelCoconutIdl {
  const processedIdl: HotelCoconutIdl = {
    ...idl,
    version: idl.version || "0.1.0",
    name: idl.name || "hotel_coconut",
    instructions: idl.instructions || [],
    accounts: (idl.accounts || []).map(preprocessIdlAccount),
    types: (idl.types || []).map(preprocessIdlAccount),
    events: (idl.events || []).map((event: any) => ({
      name: event.name,
      fields: (event.fields || []).map((field: any) => ({
        ...field,
        type: preprocessIdlType(field.type)
      }))
    })),
    errors: idl.errors || [],
    metadata: idl.metadata || { address: PROGRAM_ID }
  };

  return processedIdl;
}

export const useHotelCoconutProgram = (): HotelCoconutProgram | null => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  if (!wallet) {
    console.log("Wallet not connected");
    return null;
  }

  try {
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    
    // Ensure IDL structure
    const processedIdl = ensureIdlStructure(idl);

    console.log("Processed IDL:", JSON.stringify(processedIdl, null, 2));

    const programId = new PublicKey(PROGRAM_ID);

    // Create the program instance
    const program = new Program(processedIdl, programId, provider);

    return program;
  } catch (error) {
    console.error('Failed to create program:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
};