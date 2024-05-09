import { useSelectProgress } from '../../store/useCoreStore.selectors';
import { LinearProgress } from '@bambu/react-ui';

export function ProgressBar() {
  const progress = useSelectProgress();

  return <LinearProgress variant="determinate" value={progress} />;
}

export default ProgressBar;
