// StatCard.tsx
import React from 'react';
import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  stat: string;
  icon: IconType;
}

const StatCard: React.FC<StatCardProps> = ({ title, stat, icon }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="sm"
      borderRadius="md"
      p={5}
      w="full"
      _hover={{ boxShadow: 'md', transform: 'translateY(-5px)' }}
      transition="all 0.2s ease-in-out"
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.500">
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {stat}
          </Text>
        </Box>
        <Flex
          align="center"
          justify="center"
          w={12}
          h={12}
          rounded="full"
          bg="brand.50"
        >
          <Icon as={icon} w={6} h={6} color="brand.500" />
        </Flex>
      </Flex>
    </Box>
  );
};

export default StatCard;
