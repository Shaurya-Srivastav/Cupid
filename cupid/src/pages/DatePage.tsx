// src/pages/DatePage.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Spinner,
  VStack,
  HStack,
  Image,
  Textarea,
  Button,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

interface Location {
  name: string;
  description: string;
  location: {
    coordinates: [number, number];
  };
  address: string;
  imageUrl: string;
  rating: number;
  cost: number;
  journalEntry?: {
    notes: string;
    photos: string[];
  };
}

const DatePage: React.FC = () => {
  const { dateId } = useParams<{ dateId: string }>();
  const [itinerary, setItinerary] = useState<Location[]>([]);
  const [journalEntries, setJournalEntries] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();
  const navigate = useNavigate();

  console.log('dateId from params:', dateId);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await api.get(`/date/${dateId}`);
        setItinerary(response.data.itinerary);
        setJournalEntries(
          response.data.itinerary.reduce(
            (entries: any, location: Location, index: number) => {
              entries[index] = location.journalEntry?.notes || '';
              return entries;
            },
            {}
          )
        );
      } catch (error) {
        console.error('Error fetching itinerary:', error);
        toast({
          title: 'Error',
          description: 'Failed to load itinerary.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (dateId && dateId !== 'undefined') {
      fetchItinerary();
    } else {
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Invalid date ID.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [dateId, toast]);

  const handleSaveNotes = async () => {
    try {
      await api.put(`/date/${dateId}/journal`, {
        journalEntries: itinerary.map((location, index) => ({
          locationName: location.name,
          notes: journalEntries[index],
          photos: location.journalEntry?.photos || [],
        })),
      });
      toast({
        title: 'Success',
        description: 'Journal entries saved.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving journal entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to save journal entries.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" p={4}>
      {/* Back Button */}
      <IconButton
        aria-label="Go Back"
        icon={<FiArrowLeft />}
        variant="ghost"
        onClick={() => navigate('/dashboard')}
        mb={4}
      />

      <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
        {/* Itinerary List */}
        <Box
          flex="1"
          bg="white"
          p={4}
          borderRadius="md"
          boxShadow="md"
        >
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Date Itinerary
          </Text>
          <VStack spacing={6} align="stretch">
            {itinerary.map((location, index) => (
              <Box
                key={index}
                p={4}
                borderRadius="md"
                bg="gray.50"
                boxShadow="sm"
              >
                <HStack spacing={4} align="start">
                  <Image
                    src={location.imageUrl}
                    alt={location.name}
                    boxSize="80px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                  <Box>
                    <Text fontSize="lg" fontWeight="semibold">
                      {location.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {location.description}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Address: {location.address}
                    </Text>
                    <Text fontSize="sm">
                      Rating: {location.rating} ⭐
                    </Text>
                    <Text fontSize="sm">
                      Cost: {'$'.repeat(location.cost)}
                    </Text>
                  </Box>
                </HStack>
                <Textarea
                  mt={3}
                  placeholder="Add your notes here..."
                  value={journalEntries[index] || ''}
                  onChange={(e) =>
                    setJournalEntries((prev) => ({
                      ...prev,
                      [index]: e.target.value,
                    }))
                  }
                />
              </Box>
            ))}
          </VStack>
          <Button mt={6} colorScheme="teal" onClick={handleSaveNotes}>
            Save Journal Entries
          </Button>
        </Box>

        {/* Map */}
        <Box
          flex="1"
          h={{ base: '400px', md: 'auto' }}
          p={4}
          bg="white"
          borderRadius="md"
          boxShadow="md"
        >
          {itinerary.length > 0 && (
            <MapContainer
              center={itinerary[0].location.coordinates}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {itinerary.map((location, index) => (
                <Marker
                  key={index}
                  position={location.location.coordinates}
                  icon={
                    new L.Icon({
                      iconUrl:
                        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41],
                    })
                  }
                >
                  <Popup>
                    <Text fontWeight="bold">{location.name}</Text>
                    <Text>{location.description}</Text>
                  </Popup>
                </Marker>
              ))}
              <Polyline
                positions={itinerary.map(
                  (loc) => loc.location.coordinates
                )}
                color="blue"
              />
            </MapContainer>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default DatePage;
