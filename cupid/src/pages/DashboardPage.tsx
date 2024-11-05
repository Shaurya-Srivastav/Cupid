// src/pages/DashboardPage.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Text,
  Button,
} from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TrophyProgressCard from '../components/TrophyProgressCard';
import GoalCarousel from '../components/GoalCarousel';
import {
  FiCalendar,
  FiMapPin,
  FiActivity,
  FiHeart,
  FiClock,
  FiUsers,
  FiRefreshCcw,
} from 'react-icons/fi';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface Stats {
  totalDatesPlanned: number;
  dateNightsPerMonth: number;
  citiesVisited: number;
  totalHoursSpentTogether: number;
  coupleRankAmongFriends: number | null;
  mostFrequentActivity: string;
  trophiesEarned: number;
  tierLevel: string;
}

interface Goal {
  title: string;
  date: string;
  trophies: number;
  badge: string;
}

const DashboardPage: React.FC = () => {
  const { user, fetchUserProfile } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [shouldFetch, setShouldFetch] = useState<boolean>(true); // State to control re-fetching
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Refetch the user profile if required
        if (shouldFetch) {
          await fetchUserProfile();
          const response = await api.get('/dashboard');
          setStats(response.data.stats);
          console.log('Stats fetched from API:', response.data.stats);
          const goalsResponse = await api.get('/goals');
          console.log('Goals fetched from API:', goalsResponse.data);
          if (goalsResponse.data.length === 0) {
            // Generate new goals if none are found
            await api.post('/goals/generate');
            const newGoalsResponse = await api.get('/goals');
            setGoals(newGoalsResponse.data);
            console.log('New goals fetched from API:', newGoalsResponse.data);
          } else {
            setGoals(goalsResponse.data);
          }
          setShouldFetch(false); // Reset the flag to prevent infinite fetching
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [shouldFetch, fetchUserProfile, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleRefreshGoals = async () => {
    try {
      setLoading(true);
      // Step 1: Delete all current goals
      await api.delete('/goals/deleteAll');
      // Step 2: Generate new goals
      await api.post('/goals/generate');
      // Step 3: Fetch the newly generated goals
      const newGoalsResponse = await api.get('/goals');
      setGoals(newGoalsResponse.data);
      console.log('Goals refreshed from API:', newGoalsResponse.data);
    } catch (error) {
      console.error('Error refreshing goals:', error);
      setError('Failed to refresh goals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger re-fetch when navigating back to the dashboard page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setShouldFetch(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    console.log('Goals state in DashboardPage:', goals);
  }, [goals]);

  return (
    <Box minH="100vh" bg="gray.50">
      <Sidebar />
      <Box ml={{ base: 0, md: '80px' }} p={4}>
        <Flex justify="flex-end" mb={4}>
          <Menu>
            <MenuButton>
              <Avatar size="sm" src={user?.avatar || '/default-avatar.png'} name={user?.name || 'User'} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" minH="60vh">
            <Spinner size="xl" />
          </Flex>
        ) : error ? (
          <Flex justify="center" align="center" minH="60vh">
            <Text color="red.500">{error}</Text>
          </Flex>
        ) : stats ? (
          <>
            <TrophyProgressCard
              trophiesEarned={stats.trophiesEarned}
              tierLevel={stats.tierLevel}
            />

            <Box pt="40px">
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                <StatCard
                  title="Total Dates Planned"
                  stat={stats.totalDatesPlanned.toString()}
                  icon={FiCalendar}
                />
                <StatCard
                  title="Date Nights Per Month"
                  stat={stats.dateNightsPerMonth.toString()}
                  icon={FiActivity}
                />
                <StatCard
                  title="Cities Visited"
                  stat={stats.citiesVisited.toString()}
                  icon={FiMapPin}
                />
                <StatCard
                  title="Total Hours Spent Together"
                  stat={stats.totalHoursSpentTogether.toString()}
                  icon={FiClock}
                />
                <StatCard
                  title="Couple Rank Among Friends"
                  stat={
                    stats.coupleRankAmongFriends
                      ? `#${stats.coupleRankAmongFriends}`
                      : 'Unranked'
                  }
                  icon={FiUsers}
                />
                <StatCard
                  title="Most Frequent Activity"
                  stat={stats.mostFrequentActivity}
                  icon={FiHeart}
                />
              </SimpleGrid>
              <Flex alignItems="center" justifyContent="space-between" mt={8} mb={4}>
                <Text fontSize="2xl" fontWeight="bold">
                  Upcoming Goals
                </Text>
                <Button
                  leftIcon={<FiRefreshCcw />}
                  colorScheme="teal"
                  onClick={handleRefreshGoals}
                >
                  Refresh Goals
                </Button>
              </Flex>
              <GoalCarousel goals={goals} />
            </Box>
          </>
        ) : (
          <Flex justify="center" align="center" minH="60vh">
            <Text>No data available.</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
