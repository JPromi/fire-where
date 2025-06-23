import { SettingService } from '@/services/local/SettingService';
import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {

  const router = useRouter();

  useEffect(() => {
    // add jump
    SettingService.getByKey('jumpToFederalState').then((federalState) => {
      if (federalState) {
        if(federalState) {
          // jump to federal state
          SettingService.getByKey('jumpToDistrict').then((district) => {
            if (district) {
              // jump to district
              router.push({
                pathname: '/operation/[federalStateId]/[districtId]',
                params: { federalStateId: federalState as string, districtId: district as string },
              });
            } else {
              // jump to federal state
              router.push({
                pathname: '/operation/[federalStateId]',
                params: { federalStateId: federalState as string },
              });
            }
          });
        }
      } else {
        // no federal state set, redirect to operation
        router.push('/operation');
      }
    });
  }, []);

  return <Redirect href="/operation" />;
}
