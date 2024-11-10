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

// Fix for default marker icons not displaying correctly in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ItineraryItem {
  name: string;
  coordinates: Coordinates;
  description: string;
  rating: number;
  cost: number;
  busy: boolean;
  imageUrl: string;
  address: string;
}

interface JournalEntry {
  locationName: string;
  notes?: string;
  photos?: string[];
}

interface DateEventResponse {
  _id: string;
  userId: string;
  date: string;
  itinerary: ItineraryItem[];
  journalEntries: JournalEntry[];
}

const DatePage: React.FC = () => {
  const { dateId } = useParams<{ dateId: string }>();
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [journalEntries, setJournalEntries] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();
  const navigate = useNavigate();

  console.log('dateId from params:', dateId);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await api.get<DateEventResponse>(`/date/${dateId}`);
        const data = response.data;

        if (data && data.itinerary && data.journalEntries) {
          setItinerary(data.itinerary);
          setJournalEntries(
            data.journalEntries.reduce((entries: any, journalEntry: JournalEntry, index: number) => {
              entries[index] = journalEntry.notes || '';
              return entries;
            }, {})
          );
        } else {
          throw new Error('Invalid itinerary data received.');
        }
      } catch (error: any) {
        console.error('Error fetching itinerary:', error);
        toast({
          title: 'Error',
          description:
            error.response?.data?.message ||
            'Failed to load itinerary. Please try again later.',
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
      const updatedJournalEntries = itinerary.map((location, index) => ({
        locationName: location.name,
        notes: journalEntries[index],
        photos: [], // Assuming photos are handled elsewhere
      }));

      await api.put(`/date/${dateId}/journal`, {
        journalEntries: updatedJournalEntries,
      });
      toast({
        title: 'Success',
        description: 'Journal entries saved.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error saving journal entries:', error);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to save journal entries. Please try again later.',
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

  if (!itinerary || itinerary.length === 0) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text fontSize="xl" color="red.500">
          No itinerary found for this date.
        </Text>
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
        <Box flex="1" bg="white" p={4} borderRadius="md" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Date Itinerary
          </Text>
          <VStack spacing={6} align="stretch">
            {itinerary.map((location, index) => (
              <Box key={index} p={4} borderRadius="md" bg="gray.50" boxShadow="sm">
                <HStack spacing={4} align="start">
                  <Image
                    src={location.imageUrl || 'https://via.placeholder.com/80'}
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
                    <Text fontSize="sm">Rating: {location.rating} ⭐</Text>
                    <Text fontSize="sm">Cost: {'$'.repeat(location.cost)}</Text>
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
          <MapContainer
            center={[
              itinerary[0]?.coordinates?.latitude || 40.7128, // Default to NYC if undefined
              itinerary[0]?.coordinates?.longitude || -74.0060,
            ]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {itinerary.map((location, index) => (
              <Marker
                key={index}
                position={[
                  location.coordinates.latitude,
                  location.coordinates.longitude,
                ]}
                icon={
                  new L.Icon({
                    iconUrl:
                      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl:
                      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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
              positions={itinerary.map((loc) => [
                loc.coordinates.latitude,
                loc.coordinates.longitude,
              ])}
              color="blue"
            />
          </MapContainer>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DatePage;
