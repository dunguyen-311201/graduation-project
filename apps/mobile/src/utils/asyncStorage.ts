import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setAsyncStorage<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getAsyncStorage<T>(key: string) {
  const stringV = await AsyncStorage.getItem(key);
  if (stringV === null) {
    return null;
  }
  const value: T = JSON.parse(stringV);
  return value;
}
