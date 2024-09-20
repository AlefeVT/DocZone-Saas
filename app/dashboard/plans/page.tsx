import { currentUser } from '@/lib/auth';
import PlansView from './PlansView';

export default function Page() {
  const user = currentUser();

  return <PlansView  />;
}
