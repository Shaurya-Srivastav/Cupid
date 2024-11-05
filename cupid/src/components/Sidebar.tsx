// Sidebar.tsx
import React from 'react';
import { Box, Flex, Link, Icon, Tooltip, VStack } from '@chakra-ui/react';
import { FiHome, FiCalendar, FiUser, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { label: 'Book a Date', icon: FiCalendar, path: '/book-date' },
  { label: 'Account Info', icon: FiUser, path: '/account' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      width="80px"
      bg="white"
      boxShadow="lg"
      zIndex="1000"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      py={4}
    >
      <VStack spacing={4} align="stretch">
        {navItems.map((item) => (
          <Link
            as={RouterLink}
            to={item.path}
            key={item.label}
            style={{ textDecoration: 'none' }}
          >
            <Tooltip label={item.label} placement="right">
              <Flex
                align="center"
                justify="center"
                w="full"
                h="60px"
                cursor="pointer"
                bg={
                  location.pathname === item.path ? 'gray.100' : 'transparent'
                }
                _hover={{ bg: 'gray.100' }}
                transition="background-color 0.2s ease-in-out"
              >
                <Icon
                  as={item.icon}
                  w={6}
                  h={6}
                  color={
                    location.pathname === item.path ? 'brand.500' : 'gray.600'
                  }
                />
              </Flex>
            </Tooltip>
          </Link>
        ))}
      </VStack>
      
      <Box onClick={handleLogout} style={{ textDecoration: 'none' }}>
        <Tooltip label="Logout" placement="right">
          <Flex
            align="center"
            justify="center"
            w="full"
            h="60px"
            cursor="pointer"
            bg={location.pathname === '/logout' ? 'gray.100' : 'transparent'}
            _hover={{ bg: 'gray.100' }}
            transition="background-color 0.2s ease-in-out"
          >
            <Icon as={FiLogOut} w={6} h={6} color="gray.600" />
          </Flex>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;
