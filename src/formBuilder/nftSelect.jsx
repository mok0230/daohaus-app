import React, { useEffect, useState } from 'react';
import deepEqual from 'deep-eql';
import {
  Box,
  Text,
  Flex,
  Button,
  Icon,
  Select,
  Image,
  Input,
} from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import { useDao } from '../contexts/DaoContext';
import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';
import FieldWrapper from './fieldWrapper';

const NftSelect = props => {
  const { label, localForm, htmlFor, name } = props;
  const { register, setValue } = localForm;
  const { setGenericModal } = useOverlay();
  const { daoVaults } = useDao();
  const [nftData, setNftData] = useState();
  const [nfts, setNfts] = useState();
  const [selected, setSelected] = useState();
  const [collections, setCollections] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    if (nfts) {
      setCollections(
        nfts.reduce((acc, item) => {
          if (acc.indexOf(item.name) === -1) {
            return [...acc, item.name];
          }
          return acc;
        }, []),
      );
    }
  }, [nfts]);

  useEffect(() => {
    if (daoVaults) {
      const data = daoVaults.reduce((acc, item) => [...acc, ...item.nfts], []);
      setNftData(data);
      setNfts(data);
    }
  }, [daoVaults]);

  useEffect(() => {
    if (nftData && filter) {
      const filtered = nftData.filter(item => {
        if (filter !== '') {
          return filter === item.name;
        }
        return true;
      });
      if (!deepEqual(filtered, nfts)) {
        setNfts(filtered);
      }
    }
  }, [filter, nfts]);

  useEffect(() => {
    setValue(name, selected?.tokenAddress);
  }, [selected]);

  const openModal = () => {
    setGenericModal({ nftSelect: true });
  };

  const selectNft = e => {
    const nft = nfts[e.nativeEvent.target.value];
    setGenericModal({});
    setSelected(nft);
  };

  const onFilterChange = e => setFilter(e.nativeEvent.target.value);

  const selectModal = (
    <GenericModal closeOnOverlayClick modalId='nftSelect'>
      <Box>
        <Box
          fontFamily='heading'
          textTransform='uppercase'
          fontSize='xs'
          fontWeight={700}
          color='#7579C5'
          mb={4}
        >
          Select An NFT
        </Box>
        <Select placeholder='Filter by Collection' onChange={onFilterChange}>
          {collections?.map(collection => (
            <option value={collection} key={collection}>
              {collection}
            </option>
          ))}
        </Select>
        {nfts?.map((nft, i) => (
          <Box key={i} mt={5}>
            <Flex mb={5} alignItems='center' justify='space-between'>
              <Text textTransform='uppercase' fontFamily='header'>
                {nft.metadata.name}
              </Text>
              <Button value={i} onClick={selectNft}>
                Select
              </Button>
            </Flex>
            <Image src={nft.metadata.image} />
          </Box>
        ))}
      </Box>
    </GenericModal>
  );

  return (
    <FieldWrapper>
      <Input type='hidden' id={htmlFor} name={name} ref={register} />
      <Box>
        <Text mb={3}>{label}</Text>
        {selected ? (
          <Image
            onClick={openModal}
            _hover={{
              opacity: 0.5,
              cursor: 'pointer',
            }}
            src={selected.metadata.image}
            w='300px'
            h='300px'
          />
        ) : (
          <Button variant='nftSelect' onClick={openModal}>
            <Icon w={50} h={50} color='primary.500' as={RiAddFill} />
          </Button>
        )}
      </Box>
      {selectModal}
    </FieldWrapper>
  );
};

export default NftSelect;