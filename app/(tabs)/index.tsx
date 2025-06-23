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
                params: { federalStateId: federalStateMapping(federalState as string) as string, districtId: district as string },
              });
            } else {
              // jump to federal state
              router.push({
                pathname: '/operation/[federalStateId]',
                params: { federalStateId: federalStateMapping(federalState as string) as string },
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

  function federalStateMapping(districtLong: string): string {
    const districtMap: Record<string, string> = {
      'la': 'lower-austria',
      'ua': 'upper-austria',
      'bl': 'burgenland',
      'ty': 'tyrol',
      'st': 'styria',
      'ca': 'carinthia',
      'sb': 'salzburg',
      'vb': 'vorarlberg',
      'vi': 'vienna',
    };
    return districtMap[districtLong] || '';
  }

  return <Redirect href="/operation" />;
}
