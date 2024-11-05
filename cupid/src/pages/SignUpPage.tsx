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
import { motion } from 'framer-motion';
import api from '../services/api';

interface SignUpValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const MotionBox = motion(Box);

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const initialValues: SignUpValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm your password'),
  });

  const handleSubmit = async (values: SignUpValues, actions: any) => {
    try {
      const response = await api.post('/auth/signup', values);
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'An error occurred.',
        description:
          error.response?.data?.message || 'Unable to create account.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      actions.setSubmitting(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <MotionBox
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        maxW="lg"
        py={12}
        px={6}
        w="full"
      >
        <Stack align="center">
          <Heading fontSize={{ base: '2xl', md: '4xl' }}>
            Create your account
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'lg' }} color="gray.600">
            to start planning your perfect dates ✨
          </Text>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={{ base: 4, md: 8 }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                {/* Name Field */}
                <Field name="name">
                  {({ field, form }: any) => (
                    <FormControl
                      id="name"
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel>Name</FormLabel>
                      <Input {...field} type="text" placeholder="Your name" />
                      <FormErrorMessage>
                        {form.errors.name}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Email Field */}
                <Field name="email">
                  {({ field, form }: any) => (
                    <FormControl
                      id="email"
                      isInvalid={form.errors.email && form.touched.email}
                      mt={4}
                    >
                      <FormLabel>Email address</FormLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your-email@example.com"
                      />
                      <FormErrorMessage>
                        {form.errors.email}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Password Field */}
                <Field name="password">
                  {({ field, form }: any) => (
                    <FormControl
                      id="password"
                      isInvalid={form.errors.password && form.touched.password}
                      mt={4}
                    >
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                        />
                        <InputRightElement h="full">
                          <IconButton
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Confirm Password Field */}
                <Field name="confirmPassword">
                  {({ field, form }: any) => (
                    <FormControl
                      id="confirmPassword"
                      isInvalid={
                        form.errors.confirmPassword &&
                        form.touched.confirmPassword
                      }
                      mt={4}
                    >
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm password"
                        />
                        <InputRightElement h="full">
                          <IconButton
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {form.errors.confirmPassword}
                      </FormErrorMessage>
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
                  Sign Up
                </Button>

                <Stack pt={6}>
                  <Text align="center">
                    Already have an account?{' '}
                    <Link as={RouterLink} to="/" color="red.500">
                      Login
                    </Link>
                  </Text>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </MotionBox>
    </Flex>
  );
};

export default SignUpPage;
