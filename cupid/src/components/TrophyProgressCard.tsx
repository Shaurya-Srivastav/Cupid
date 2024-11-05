// TrophyProgressCard.tsx
import React from 'react';
import {
  Box,
  Text,
  Flex,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
} from '@chakra-ui/react';

interface TrophyProgressCardProps {
  trophiesEarned: number;
  tierLevel: string;
}

const tiers = [
  { name: 'Bronze', min: 0, max: 99 },
  { name: 'Silver', min: 100, max: 199 },
  { name: 'Gold', min: 200, max: 299 },
  { name: 'Platinum', min: 300, max: 399 },
  { name: 'Diamond', min: 400, max: 499 },
  { name: 'Master', min: 500, max: 599 },
  { name: 'Grandmaster', min: 600, max: 699 },
  { name: 'Challenger', min: 700, max: Infinity },
];

const TrophyProgressCard: React.FC<TrophyProgressCardProps> = ({
  trophiesEarned,
  tierLevel,
}) => {
  const currentTier = tiers.find((tier) => tier.name === tierLevel) || tiers[0];
  const nextTier =
    tiers[tiers.indexOf(currentTier) + 1] || tiers[tiers.length - 1];
  const progress =
    ((trophiesEarned - currentTier.min) / (nextTier.min - currentTier.min)) *
    100;

  return (
    <Flex justify="center" mt={6}>
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="sm"
        borderRadius="md"
        p={6}
        w="full"
        maxW="400px"
        textAlign="center"
      >
        <CircularProgress
          value={progress}
          size="120px"
          thickness="8px"
          color="brand.500"
          trackColor="gray.200"
          mb={4}
        >
          <CircularProgressLabel fontSize="lg" color="brand.500">
            {`${Math.round(progress)}%`}
          </CircularProgressLabel>
        </CircularProgress>
        <Text fontWeight="bold" fontSize="lg">
          Trophies Earned: {trophiesEarned}
        </Text>
        <Text mt={2}>Tier Level: {tierLevel}</Text>
      </Box>
    </Flex>
  );
};

export default TrophyProgressCard;
