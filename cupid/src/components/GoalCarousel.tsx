// GoalCarousel.tsx
import React, { useEffect } from 'react';
import {
  Box,
  Text,
  Badge,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface Goal {
  title: string;
  date: string;
  trophies: number;
  badge: string;
}

interface GoalCarouselProps {
  goals: Goal[];
}

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
};

// Custom arrows for the carousel
const CustomLeftArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <IconButton
      aria-label="Previous"
      icon={<FiChevronLeft />}
      onClick={onClick}
      position="absolute"
      left="-20px"
      top="calc(50% - 20px)"
      size="sm"
      variant="ghost"
      _focus={{ boxShadow: 'none' }}
    />
  );
};

const CustomRightArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <IconButton
      aria-label="Next"
      icon={<FiChevronRight />}
      onClick={onClick}
      position="absolute"
      right="-20px"
      top="calc(50% - 20px)"
      size="sm"
      variant="ghost"
      _focus={{ boxShadow: 'none' }}
    />
  );
};

const GoalCarousel: React.FC<GoalCarouselProps> = ({ goals }) => {
  useEffect(() => {
    console.log('Goals in GoalCarousel:', goals);
  }, [goals]);

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="sm"
      borderRadius="md"
      p={6}
      w="full"
      mt={8}
      mb={8} // Added margin-bottom for more space below the goals
      position="relative"
    >
      <Carousel
        responsive={responsive}
        swipeable
        draggable
        showDots
        infinite={false}
        autoPlay={false}
        keyBoardControl
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        renderDotsOutside
      >
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <Box
              key={index}
              p={4}
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              mx={2}
              h="200px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}
            >
              <Box>
                <Text fontSize="lg" fontWeight="semibold">
                  {goal.title}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Complete by {new Date(goal.date).toLocaleDateString()}
                </Text>
              </Box>
              <Box>
                <Text color="gray.700" mt={2} fontSize="sm">
                  Trophies: {goal.trophies}
                </Text>
                <Badge colorScheme="red" mt={1}>
                  {goal.badge}
                </Badge>
              </Box>
            </Box>
          ))
        ) : (
          <Text>No goals available</Text>
        )}
      </Carousel>
    </Box>
  );
};

export default GoalCarousel;