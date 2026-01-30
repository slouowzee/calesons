import {useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const useAppStateListener = (
  onForeground?: () => void,
  onBackground?: () => void,
) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const onForegroundRef = useRef(onForeground);
  const onBackgroundRef = useRef(onBackground);

  onForegroundRef.current = onForeground;
  onBackgroundRef.current = onBackground;

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        onForegroundRef.current?.();
      } else if (nextAppState.match(/inactive|background/)) {
        onBackgroundRef.current?.();
      }
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  return {
    appState,
  };
};
