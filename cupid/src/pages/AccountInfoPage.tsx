// src/pages/AccountInfoPage.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  HStack,
  Image,
  IconButton,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  Progress,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import api from '../services/api';

const AccountInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [profile, setProfile] = useState({
    name: '',
    nickname: '',
    bio: '',
    avatar: '',
    stats: {
      trophiesEarned: 0,
      tierLevel: '',
    },
  });

  const [completedGoals, setCompletedGoals] = useState<any[]>([]);
  const [dateHistory, setDateHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await api.get('/account');
        console.log('Fetched account info:', response.data);
        setProfile({
          name: response.data.name || '',
          nickname: response.data.profile?.nickname || '',
          bio: response.data.profile?.bio || '',
          avatar: response.data.avatar || '',
          stats: response.data.stats || { trophiesEarned: 0, tierLevel: '' },
        });
        setCompletedGoals(response.data.completedGoals || []);
        setDateHistory(response.data.dateHistory || []);
      } catch (error) {
        console.error('Error fetching account info:', error);
        toast({
          title: 'Error fetching account info.',
          description: 'There was a problem retrieving your account information.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchAccountInfo();
  }, [toast]);

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveChanges = async () => {
    try {
      await api.put('/account', {
        name: profile.name,
        nickname: profile.nickname,
        bio: profile.bio,
        avatar: profile.avatar,
      });
      toast({
        title: 'Profile updated.',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile.',
        description: 'Unable to update your profile.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);

      try {
        const response = await api.post('/account/upload-avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProfile((prevProfile) => ({ ...prevProfile, avatar: response.data.imageUrl }));
        toast({
          title: 'Profile picture updated.',
          description: 'Your profile picture has been updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Error uploading image.',
          description: 'There was a problem uploading your profile picture.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" p={4}>
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="Back to Dashboard"
        onClick={() => navigate('/dashboard')}
        mb={4}
      />

      <Flex direction="column" align="center" maxW="800px" mx="auto">
        <Avatar
          size="2xl"
          src={profile.avatar || undefined}
          mb={4}
          name={profile.name}
        />
        <Button variant="outline" mb={4} as="label">
          Change Profile Picture
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </Button>

        <FormControl id="name" mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            value={profile.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </FormControl>

        <FormControl id="nickname" mb={4}>
          <FormLabel>Nickname</FormLabel>
          <Input
            value={profile.nickname || ''}
            onChange={(e) => handleInputChange('nickname', e.target.value)}
          />
        </FormControl>

        <FormControl id="bio" mb={4}>
          <FormLabel>Bio</FormLabel>
          <Textarea
            value={profile.bio || ''}
            onChange={(e) => handleInputChange('bio', e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" mb={8} onClick={handleSaveChanges}>
          Save Changes
        </Button>

        <Flex
          justify="center"
          align="center"
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="md"
          w="full"
          mb={8}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box textAlign="center" mb={{ base: 4, md: 0 }}>
            <Text fontSize="3xl" fontWeight="bold">
              Trophies Earned
            </Text>
            <Text fontSize="6xl" color="purple.500" fontWeight="bold">
              {profile.stats.trophiesEarned}
            </Text>
          </Box>
          <Box
            textAlign="center"
            ml={{ base: 0, md: 8 }}
            borderLeft={{ base: 'none', md: '1px solid gray' }}
            pl={{ base: 0, md: 8 }}
          >
            <Text fontSize="3xl" fontWeight="bold">
              Tier Level
            </Text>
            <Badge colorScheme="purple" fontSize="2xl" px={4} py={2}>
              {profile.stats.tierLevel}
            </Badge>
          </Box>
        </Flex>

        <Box bg="white" p={6} borderRadius="md" boxShadow="md" w="full" mb={8}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Progress to Next Tier
          </Text>
          <Progress
            value={profile.stats.trophiesEarned % 100}
            max={100}
            colorScheme="purple"
            size="lg"
            borderRadius="md"
          />
        </Box>

        <Tabs variant="enclosed-colored" w="full">
          <TabList>
            <Tab>Completed Goals</Tab>
            <Tab>Date History</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                {completedGoals.map((goal: any) => (
                  <GridItem
                    key={goal._id}
                    bg="white"
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                  >
                    <Text fontWeight="bold" fontSize="lg" mb={2}>
                      {goal.goalId.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Completed on: {new Date(goal.dateCompleted).toLocaleDateString()}
                    </Text>
                    <Badge colorScheme="green" mb={2}>
                      Trophies: {goal.goalId.trophies}
                    </Badge>
                    <Badge colorScheme="blue" ml={2}>
                      Badge: {goal.goalId.badge}
                    </Badge>
                  </GridItem>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch" w="100%">
                {dateHistory.map((date: any) => (
                  <HStack
                    key={date._id}
                    p={4}
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                    cursor="pointer"
                    onClick={() => navigate(`/date/${date._id}`)}
                  >
                    <Image
                      src={date.imageUrl || 'https://source.unsplash.com/featured/?date'}
                      alt="Date"
                      boxSize="60px"
                      borderRadius="md"
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontWeight="semibold">
                        Date on {new Date(date.date).toLocaleDateString()}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default AccountInfoPage;
