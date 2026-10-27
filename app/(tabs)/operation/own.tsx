import { ThemedView } from "@/components/ThemedView";
import { GrisuOperation } from "@/dtos/GrisuOperation.dto";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { LaInfoscreenService } from "@/services/LaInfoscreenService";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function OwnScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const dynamicSide = useDynamicSide();

  const pageTitle = title("Eigene Einsatz Historie");
  useHeaderTitleOnFocus(pageTitle);

  const [laOperations, setLaOperations] = useState<GrisuOperation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadOperations();
  }, [router]);

  function loadOperations() {
    LaInfoscreenService.getHistoryOperations().then((res) => {
      if (res?.CurrentState == "data") {
        setLaOperations(res.EinsatzData);
      }
      setLoading(false);
    });
  }

  function getDate(dateString: string | undefined): string {
    if(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return t('common.unknown');
    }
  }

  return (
    <>
      <ThemedView
        style={{
          flex: 1,
        }}
      >
        {/* ToDo */}
        {/* 
        - Show list of operations
        - Load operations from Operation Point to get UUIDs
         */}
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentList: {
    width: '100%',
    maxWidth: 1000,
    marginHorizontal: 'auto',
  },
});
