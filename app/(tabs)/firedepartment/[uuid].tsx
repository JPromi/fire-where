import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TagChip } from "@/components/ui/TagChip";
import { Colors } from "@/constants/Colors";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { Firedepartment } from "@/models/Firedepartment";
import { FiredepartmentService } from "@/services/FiredeparmentService";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

export default function FiredepartmentDetailScreen() {
  const dynamicSide = useDynamicSide();
  const screenWidth = Dimensions.get('window').width;
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  const [firedepartment, setFiredepartment] = useState<Firedepartment>({} as Firedepartment);

  useEffect(() => {
      FiredepartmentService.getFiredepartmentByUuid(uuid)
                .then(setFiredepartment)
                .catch(error => {
                  console.error(error);
                  // setErrorMessage(
                  //   {
                  //     message: error.request.status === 404 ? t('common.error.notFound') : t('common.error.internalServerError'),
                  //     isNecessary: true,
                  //   }
                  // );
                })
                .finally(() => setLoading(false));
    }, [uuid]);

  return (
    <>
      <Stack.Screen
        options={{
          title: firedepartment.name || "",
        }}/>
        <ThemedView style={styles.container}>
          <ScrollView style={[styles.containerScrollView]}>
            {/* Header Image */}
            <View
              style={{ 
                position: 'relative',
                width: '100%',
                marginTop: screenWidth > 1000 ? 20 : 0,
                borderRadius: screenWidth > 1000 ? 8 : 0,
                height: screenWidth > 1000 ? 200 : 150,
                display: 'flex',
                overflow: 'hidden',
                justifyContent: 'center',
              }}>
              <Image
                source={{ uri: "https://www.ziegler.de/mediadatabase/service/bilder/picture_calendar_2020_smartphone_wallpapers/ziegler-2020-03-hlf20.jpg" }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}/>
                { Platform.OS === 'web' ? (
                  <img
                    src="https://www.feuerwehr-mariazell.at/wp-content/uploads/2015/06/2000px-Korpsabzeichen-FFOE.svg_.png"
                    style={{
                      position: 'absolute',
                      minWidth: 100,
                      height: "50%",
                      left: "5%",
                      objectFit: 'contain',
                      filter: "drop-shadow(0 0 10px " + (Colors[colorScheme ?? 'light'].background + "88") + ")",
                    }}/>
                ) : (
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'absolute',
                      minWidth: "100%",
                      height: "100%",
                      shadowColor: Colors[colorScheme ?? 'light'].background,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: .75,
                      shadowRadius: 10,
                    }}>

                    <Image
                      source={{ uri: "https://www.feuerwehr-mariazell.at/wp-content/uploads/2015/06/2000px-Korpsabzeichen-FFOE.svg_.png" }}
                      style={{
                        width: 100,
                        height: "50%",
                        left: "5%",
                        objectFit: 'contain',
                        
                      }}/>
                  </View>
                )}
            </View>

            {/* content */}
            <View style={[{
              padding: 20,
              paddingLeft: dynamicSide.left + 20,
              paddingRight: dynamicSide.right + 20,
              display: 'flex',
              flexDirection: 'column',
              }]}>

              {/* Title, chips, links */}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 10,
                }}>
                {/* Title */}
                <Text style={{
                fontWeight: 'bold',
                fontSize: 28,
                color: Colors[colorScheme ?? 'light'].text,
                }}>{firedepartment.name}</Text>

                {/* chips */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    columnGap: 8,
                    rowGap: 10,
                    marginBottom: 20,
                  }}>
                    {firedepartment.isVolunteer && (<TagChip name="Freiwillig" icon={"heart.fill"} tagColor="#33C2CC"/>)}
                    {true && (<TagChip name="Einsatzbereit" icon={"flame.fill"} tagColor="#13F24E"/>)}
                </View>

                {/* links */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 15,
                  }}>
                    {firedepartment.contact?.website && (
                      <Pressable onPress={() => {
                        Linking.openURL(firedepartment.contact?.website!);
                      }}>
                        <IconSymbol name="globe" size={25} color={Colors[colorScheme ?? 'light'].textSub} />
                      </Pressable>
                    )}
                </View>
              </View>
            </View>
          </ScrollView>
        </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerScrollView: {
    width: '100%',
    maxWidth: 1000,
    marginHorizontal: 'auto',
  }
});
