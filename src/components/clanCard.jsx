import React from 'react';
import { FaRegHandshake } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Box, Button, Icon } from '@chakra-ui/react';

import ContentBox from './ContentBox';

const ClanCard = () => {
  return (
    <ContentBox
      d='flex'
      minWidth='280px'
      width='100%'
      maxWidth='400px'
      mr={4}
      mb={4}
      flexDirection='column'
      alignItems='center'
      justifyContent='space-around'
    >
      <Box fontFamily='heading' fontSize='2xl' mb={3} fontWeight={700}>
        Clan
      </Box>
      <Box fontSize='sm' textTransform='center'>
        Stake $HAUS as a DAO
      </Box>
      <Box fontSize='sm' textAlign='center' mb={3}>
        Get 3x Rewards + UberGovernance
      </Box>
      <Box fontSize='sm' textAlign='center' mb={3}>
        {`Visit the Allies (${(
          <Icon as={FaRegHandshake} />
        )}) page in your DAO to stake as a DAO`}
      </Box>

      <Button
        as={Link}
        to='/'
        isExternal
        px='2.5rem'
        mb={5}
        textTransform='uppercase'
      >
        Go to Hub
      </Button>
    </ContentBox>
  );
};

export default ClanCard;
