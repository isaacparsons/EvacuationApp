import React, { useState } from 'react';
import {
  TextField,
  Box,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';

import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { UPDATE_USER } from '../../graphql/auth';

const CompleteSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER);

  const onSubmit = async (data: any) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
    updateUser({
      variables: {
        password: data.password,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName
      },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {data ? (
        <Typography>Signup complete! Open the app to login</Typography>
      ) : (
        <Box display="flex" flexDirection={'column'}>
          <Typography>Complete Signup</Typography>
          <TextField
            // error={errors.password}
            style={styles.textInput}
            helperText={errors.email?.type === 'required'}
            id="firstName"
            label="First Name"
            {...register('firstName', { required: true })}
          />
          <TextField
            // error={errors.password}
            style={styles.textInput}
            helperText={errors.email?.type === 'required'}
            id="lastName"
            label="Last Name"
            {...register('lastName', { required: true })}
          />
          <TextField
            // error={errors.password}
            style={styles.textInput}
            helperText={errors.email?.type === 'required'}
            id="phoneNumber"
            type="phone number"
            label="Phone Number"
            {...register('phoneNumber', { required: true })}
          />
          <TextField
            // error={errors.password}
            style={styles.textInput}
            helperText={errors.password?.type === 'required'}
            id="password"
            type="password"
            label="Password"
            {...register('password', { required: true })}
          />
          <TextField
            // error={errors.password}
            style={styles.textInput}
            helperText={errors.password?.type === 'required'}
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            {...register('confirmPassword', { required: true })}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Signup
            </Button>
          )}

          {error ? <Typography color="red">{error.message} </Typography> : null}
        </Box>
      )}
    </Box>
  );
};

const styles = {
  textInput: {
    margin: 10
  }
};

export default CompleteSignup;
