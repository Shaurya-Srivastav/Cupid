// src/pages/LoginPage.tsx

import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormErrorMessage,
  Link,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface LoginValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: LoginValues, actions: any) => {
    try {
      const response = await api.post('/auth/login', values);
      toast({
        title: 'Logged in successfully.',
        description: 'Welcome back!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      actions.setSubmitting(false);
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'An error occurred.',
        description: error.response?.data?.message || 'Unable to login.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      actions.setSubmitting(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        maxW="lg"
        py={12}
        px={6}
        w="full"
        bg="white"
        boxShadow="lg"
        rounded="lg"
        p={{ base: 4, md: 8 }}
      >
        <Stack align="center" mb={6}>
          <Heading fontSize={{ base: '2xl', md: '4xl' }}>Login to your account</Heading>
          <Text fontSize={{ base: 'sm', md: 'lg' }} color="gray.600">
            to continue planning your perfect dates ✨
          </Text>
        </Stack>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, isValid }) => (
            <Form>
              {/* Email Field */}
              <Field name="email">
                {({ field, form }: any) => (
                  <FormControl id="email" isInvalid={form.errors.email && form.touched.email}>
                    <FormLabel>Email address</FormLabel>
                    <Input {...field} type="email" placeholder="your-email@example.com" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              {/* Password Field */}
              <Field name="password">
                {({ field, form }: any) => (
                  <FormControl id="password" isInvalid={form.errors.password && form.touched.password} mt={4}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                      />
                      <InputRightElement h="full">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button
                type="submit"
                colorScheme="red"
                variant="solid"
                width="full"
                mt={6}
                isLoading={isSubmitting}
                isDisabled={!isValid || isSubmitting}
              >
                Login
              </Button>

              <Stack pt={6}>
                <Text align="center">
                  Don't have an account?{' '}
                  <Link as={RouterLink} to="/signup" color="red.500">
                    Sign Up
                  </Link>
                </Text>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};

export default LoginPage;
