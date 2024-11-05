// src/pages/BookDatePage.tsx

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  CheckboxGroup,
  Checkbox,
  Button,
  useToast,
  RadioGroup,
  Radio,
  IconButton,
  Flex,
  Grid,
  ScaleFade,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../services/api';

const BookDatePage: React.FC = () => {
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [transportMode, setTransportMode] = useState('driving');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Validate all required fields
    if (!city || interests.length === 0 || !budget || !dateTime || !transportMode) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/date/generate', {
        city,
        interests,
        budget,
        dateTime,
        transportMode,
      });

      if (response.data && response.data.dateId) {
        navigate(`/date/${response.data.dateId}`);
      } else {
        throw new Error('No dateId returned from API');
      }
    } catch (error: any) {
      // Handle specific error responses
      if (error.response) {
        if (error.response.status === 429) {
          toast({
            title: 'Rate Limit Exceeded',
            description: 'You have exceeded the number of allowed requests. Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else if (error.response.data && error.response.data.message) {
          toast({
            title: 'Error',
            description: error.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to generate date. Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // Handle network or unexpected errors
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Colors based on theme mode
  const cardBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Flex
      direction="column"
      align="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
      minH="100vh"
      p={4}
      transition="background-color 0.3s ease"
    >
      {/* Back Button */}
      <IconButton
        aria-label="Go Back"
        icon={<FiArrowLeft />}
        variant="ghost"
        onClick={() => navigate('/dashboard')}
        mb={4}
        alignSelf="flex-start"
        ml={4}
        size="lg"
        transition="all 0.2s"
        _hover={{ transform: 'scale(1.1)', bg: 'gray.100' }}
      />

      <ScaleFade initialScale={0.9} in={true}>
        <Box
          width="100%"
          maxW="700px"
          bg={cardBg}
          borderRadius="lg"
          p={8}
          boxShadow="2xl"
          m={4}
          borderWidth="1px"
          borderColor={borderColor}
          transition="background-color 0.3s ease, box-shadow 0.3s ease"
        >
          <Heading
            as="h2"
            size="xl"
            mb={6}
            textAlign="center"
            color="brand.500"
            fontFamily="heading"
            transition="color 0.3s ease"
          >
            Plan Your Perfect Date
          </Heading>

          <Stack spacing={6}>
            <FormControl id="city" isRequired>
              <FormLabel fontWeight="medium">City</FormLabel>
              <Input
                placeholder="Enter the city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: 'brand.300' }}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: 'outline',
                }}
                transition="border-color 0.2s"
              />
            </FormControl>

            <FormControl id="interests" isRequired>
              <FormLabel fontWeight="medium">Interests</FormLabel>
              <CheckboxGroup
                value={interests}
                onChange={(values) => setInterests(values as string[])}
              >
                <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={3}>
                  {[
                    'Restaurants',
                    'Museums',
                    'Parks',
                    'Movies',
                    'Nightlife',
                    'Shopping',
                    'Theaters',
                    'Coffee',
                  ].map((interest) => (
                    <Checkbox
                      key={interest.toLowerCase()}
                      value={interest.toLowerCase()}
                      colorScheme="brand"
                      borderColor={borderColor}
                      _checked={{
                        bg: 'brand.500',
                        color: 'white',
                        borderColor: 'brand.500',
                      }}
                      _focus={{
                        boxShadow: 'outline',
                      }}
                      transition="all 0.2s"
                    >
                      {interest}
                    </Checkbox>
                  ))}
                </Grid>
              </CheckboxGroup>
            </FormControl>

            <FormControl id="budget" isRequired>
              <FormLabel fontWeight="medium">Budget</FormLabel>
              <Select
                placeholder="Select your budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: 'brand.300' }}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: 'outline',
                }}
                transition="border-color 0.2s"
              >
                <option value="$">$ (Low)</option>
                <option value="$$">$$ (Medium)</option>
                <option value="$$$">$$$ (High)</option>
                <option value="$$$$">$$$$ (Luxury)</option>
              </Select>
            </FormControl>

            <FormControl id="dateTime" isRequired>
              <FormLabel fontWeight="medium">Date and Time</FormLabel>
              <Input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: 'brand.300' }}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: 'outline',
                }}
                transition="border-color 0.2s"
              />
            </FormControl>

            <FormControl id="transportMode" isRequired>
              <FormLabel fontWeight="medium">Preferred Transport Mode</FormLabel>
              <RadioGroup onChange={setTransportMode} value={transportMode}>
                <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={3}>
                  {['Driving', 'Walking', 'Bicycling', 'Public Transit'].map((mode) => (
                    <Radio
                      key={mode.toLowerCase()}
                      value={mode.toLowerCase()}
                      colorScheme="brand"
                      borderColor={borderColor}
                      _checked={{
                        bg: 'brand.500',
                        color: 'white',
                        borderColor: 'brand.500',
                      }}
                      _focus={{
                        boxShadow: 'outline',
                      }}
                      transition="all 0.2s"
                    >
                      {mode}
                    </Radio>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>

            <Button
              colorScheme="red"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Generating..."
              mt={4}
              _hover={{ bg: 'brand.600' }}
              transition="background-color 0.2s"
            >
              Generate Date
            </Button>
          </Stack>
        </Box>
      </ScaleFade>
    </Flex>
  );
};

export default BookDatePage;
