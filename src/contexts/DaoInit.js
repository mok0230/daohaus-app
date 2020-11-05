import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { DaoService, USER_TYPE } from '../utils/dao-service';
import { get } from '../utils/requests';

import {
  useLoading,
  useUser,
  useWeb3Connect,
  useMemberWallet,
  useContracts,
  useDaoMetadata,
} from './PokemolContext';

const DaoInit = () => {
  const location = useLocation();
  const [, updateLoading] = useLoading();
  const [contracts, updateContracts] = useContracts();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();
  const [web3Connect] = useWeb3Connect();
  const [, updateMemberWallet] = useMemberWallet();
  const [user] = useUser();

  useEffect(() => {
    var pathname = location.pathname.split('/');
    const daoParam = pathname[2];
    const regex = RegExp('0x[0-9a-f]{10,40}');
    const validParam =
      pathname[1] === 'dao' && regex.test(daoParam) ? daoParam : false;

    if (!validParam) {
      updateDaoMetadata(null);
      return;
    }

    if (!daoMetadata || daoMetadata.address !== daoParam) {
      initDao(daoParam);
    }
    // eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    const needsUserDaoService =
      daoMetadata &&
      user &&
      contracts.daoService &&
      user.username !== contracts.daoService.accountAddr;
    if (needsUserDaoService) {
      console.log('*** needs dao service update');
      initWeb3DaoService();
    }

    // eslint-disable-next-line
  }, [user, daoMetadata]);

  useEffect(() => {
    const noDaoService = !daoMetadata || !contracts.daoService;
    const notSignedIn = !user || user.type === USER_TYPE.READ_ONLY;
    if (noDaoService || notSignedIn) {
      return;
    }

    initMemberWallet();
    // eslint-disable-next-line
  }, [daoMetadata, user]);

  const initDao = async (daoParam) => {
    // console.log('###############init dao');
    updateLoading(true);

    let daoRes;
    try {
      daoRes = await get(`moloch/${daoParam}`);
    } catch (err) {
      console.log('api fetch error', daoParam);
    }

    const boostRes = await get(`boosts/${daoParam}`);
    const boosts = boostRes.data.reduce((boosts, boostData) => {
      const metadata = boostData.metadata
        ? JSON.parse(boostData.metadata[0])
        : null;
      boosts[boostData.boostKey] = {
        active: boostData.active,
        metadata,
      };
      return boosts;
    }, {});

    const version = daoRes && daoRes.data.version ? daoRes.data.version : '1';
    const daoService =
      user && web3Connect.provider
        ? await DaoService.instantiateWithWeb3(
            user.username,
            web3Connect.provider,
            daoParam,
            version,
          )
        : await DaoService.instantiateWithReadOnly(daoParam, version);

    const currentPeriod = await daoService.moloch.getCurrentPeriod();

    const apiData = daoRes ? daoRes.data : {};
    updateDaoMetadata({
      address: daoParam,
      version,
      ...apiData,
      boosts,
      currentPeriod: parseInt(currentPeriod),
    });

    updateContracts({ daoService });

    updateLoading(false);
  };

  const initWeb3DaoService = async () => {
    const daoService = await DaoService.instantiateWithWeb3(
      user.username,
      web3Connect.provider,
      daoMetadata.address,
      daoMetadata.version,
    );

    updateContracts({ daoService });
  };

  const initMemberWallet = async () => {
    // TODO: Do we still need all these?
    const addrByDelegateKey = await contracts.daoService.moloch.memberAddressByDelegateKey(
      user.username,
    );
    const tokenBalanceWei = await contracts.daoService.token.balanceOf(
      user.username,
    );
    const allowanceWei = await contracts.daoService.token.allowance(
      user.username,
      contracts.daoService.daoAddress,
    );
    const tokenBalance = contracts.daoService.web3.utils.fromWei(
      tokenBalanceWei,
    );
    const allowance = contracts.daoService.web3.utils.fromWei(allowanceWei);
    const member = await contracts.daoService.moloch.members(addrByDelegateKey);
    const shares = parseInt(member.shares) || 0;
    const loot = parseInt(member.loot) || 0;
    const jailed = parseInt(member.jailed) || 0;
    const highestIndexYesVote = member.highestIndexYesVote;
    let eth = 0;
    eth = await contracts.daoService.getAccountEth();
    const wallet = {
      tokenBalance,
      allowance,
      eth,
      loot,
      highestIndexYesVote,
      jailed,
      shares,
      addrByDelegateKey,
    };

    updateMemberWallet(wallet);
  };

  return <></>;
};

export default DaoInit;