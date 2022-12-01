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

const ChangePassword = () => {
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
      variables: { password: data.password },
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
      justifyContent="center"
      alignItems="center"
    >
      {data ? (
        <Typography>Password Changed!</Typography>
      ) : (
        <Box display="flex" flexDirection={'column'}>
          <Typography>Update Password</Typography>
          <TextField
            style={styles.textInput}
            // error={errors.password}
            helperText={
              errors.password?.type === 'required' && 'password required'
            }
            id="password"
            type="password"
            label="Password"
            {...register('password', { required: true })}
          />
          <TextField
            style={styles.textInput}
            // error={errors.password}
            helperText={
              errors.confirmPassword?.type === 'required' && 'password required'
            }
            id="confirm-password"
            type="password"
            label="Confirm Password"
            {...register('confirmPassword', { required: true })}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Reset Password
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

export default ChangePassword;
