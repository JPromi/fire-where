import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TagChip } from "@/components/ui/TagChip";
import { Colors } from "@/constants/Colors";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { Firedepartment } from "@/models/Firedepartment";
import { FiredepartmentService } from "@/services/FiredeparmentService";
import * as faBrand from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SvgUri } from "react-native-svg";

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
                source={{ uri: firedepartment.banner ?? "" }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}/>
                { firedepartment.logo ? (Platform.OS === 'web' ? (
                  <img
                    src={ firedepartment.logo ?? "" }
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
                    { firedepartment.logo.split('.').pop()?.toLowerCase() === 'svg' ? (
                      <SvgUri
                          uri={firedepartment.logo ?? ""}
                          width={100}
                          height="60%"
                          style={{
                            left: "5%",
                          }}
                          preserveAspectRatio="xMidYMid meet"
                        />
                    ) : (
                      <Image
                        source={{ uri: firedepartment.logo ?? "" }}
                        style={{
                          width: 100,
                          height: "60%",
                          left: "5%",
                          objectFit: 'contain',
                        }}/>
                    )}
                  </View>
                )) : null }
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
                    marginBottom: 0,
                  }}>
                    {firedepartment.isVolunteer && (<TagChip name="Freiwillig" icon={"heart.fill"} tagColor="#33C2CC"/>)}
                    {true && (<TagChip name="Einsatzbereit" icon={"flame.fill"} tagColor="#13F24E"/>)}
                </View>

                {/* links */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 0,
                  }}>
                    {firedepartment.links && firedepartment.links.map((link) => (
                      <Pressable
                        key={link.url}
                        onPress={() => Linking.openURL(link.url)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: 44,
                          height: 44,
                          justifyContent: 'center',

                        }}
                      >
                        {(() => {
                          switch (link.type) {
                            case 'instagram':
                              return (
                                <>
                                  <FontAwesomeIcon icon={faBrand.faInstagram} size={25} color={Colors[colorScheme ?? 'light'].textSub}/>
                                </>
                              );
                            case 'facebook':
                              return (
                                <>
                                  <FontAwesomeIcon icon={faBrand.faFacebook} size={25} color={Colors[colorScheme ?? 'light'].textSub}/>
                                </>
                              );
                            case 'x':
                              return (
                                <>
                                  <FontAwesomeIcon icon={faBrand.faXTwitter} size={25} color={Colors[colorScheme ?? 'light'].textSub}/>
                                </>
                              );
                            case 'youtube':
                              return (
                                <>
                                  <FontAwesomeIcon icon={faBrand.faYoutube} size={25} color={Colors[colorScheme ?? 'light'].textSub}/>
                                </>
                              );
                            case 'tiktok':
                              return (
                                <>
                                  <FontAwesomeIcon icon={faBrand.faTiktok} size={25} color={Colors[colorScheme ?? 'light'].textSub}/>
                                </>
                              );
                            case 'flickr':
                              return (
                                <>
                                  <FontAwesomeIcon icon={faBrand.faFlickr} size={25} color={Colors[colorScheme ?? 'light'].textSub}/>
                                </>
                              );
                            default:
                              return (
                                <>
                                  <IconSymbol
                                    name="globe"
                                    size={25}
                                    color={Colors[colorScheme ?? 'light'].textSub}
                                  />
                                </>
                              );
                          }
                        })()}
                      </Pressable>
                    ))}
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
