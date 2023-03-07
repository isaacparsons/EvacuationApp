import { Box, Typography } from '@mui/material';
import { email } from 'config';

const Support = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection={'column'}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h2">Support</Typography>
      <Box padding={10}>
        <Typography variant="body1">
          {`The Kiwetinohk Communication app was created as an internal tool for
          the company Kiwetinohk Energy. It is was created to provide the
          employees of the company with different tools such as communication
          and an evacuation response system. If you have any questions or concerns contact the developer at ${email}`}
        </Typography>
      </Box>
    </Box>
  );
};

const styles = {
  textInput: {
    margin: 10
  }
};

export default Support;
