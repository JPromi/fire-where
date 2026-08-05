import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVOURITES_KEY = "firedepartment_favourites";

export class FavouritesService {
  static async getFavouriteIds(): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(FAVOURITES_KEY);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error("Error retrieving favourites:", error);
      return [];
    }
  }

  static async isFavourite(uuid: string): Promise<boolean> {
    const favourites = await this.getFavouriteIds();
    return favourites.includes(uuid);
  }

  static async addFavourite(uuid: string): Promise<void> {
    const favourites = await this.getFavouriteIds();

    if (!favourites.includes(uuid)) {
      await AsyncStorage.setItem(
        FAVOURITES_KEY,
        JSON.stringify([...favourites, uuid])
      );
    }
  }

  static async removeFavourite(uuid: string): Promise<void> {
    const favourites = await this.getFavouriteIds();

    await AsyncStorage.setItem(
      FAVOURITES_KEY,
      JSON.stringify(favourites.filter(id => id !== uuid))
    );
  }

  static async countFavourites(): Promise<number> {
    const favourites = await this.getFavouriteIds();
    return favourites.length;
  }
}