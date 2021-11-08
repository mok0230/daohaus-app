import { useTX } from '../contexts/TXContext';

const defaults = ['isConnected', 'isSameChain', 'isMember'];

const useCanInteract = (params = {}) => {
  const { checkList = defaults, errorDeliveryType = 'firstString' } = params;
  const { checkState } = useTX();
  const result = checkState(checkList, errorDeliveryType);
  if (
    errorDeliveryType === 'softErrors' ||
    errorDeliveryType === 'arrayOfStrings'
  ) {
    return {
      canInteract: result === true,
      interactErrors: result?.length ? result : false,
    };
  }
  if (errorDeliveryType === 'firstString') {
    return {
      canInteract: result === true,
      interactErrors: typeof result === 'string' ? result : false,
    };
  }
};

export default useCanInteract;
