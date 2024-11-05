// LoadingPage.tsx
import React, { useEffect } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = (location.state as any)?.answers;

  useEffect(() => {
    // Simulate an API call
    const timer = setTimeout(() => {
      navigate('/date', { state: { answers } });
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [navigate, answers]);

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" color="brand.500" />
      <Text mt={4} fontSize="lg">
        Planning your perfect date...
      </Text>
    </Box>
  );
};

export default LoadingPage;
