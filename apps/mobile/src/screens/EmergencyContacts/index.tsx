import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';

import {
  AppButton,
  Avatar,
  CustomInput,
  ListRow,
  ScreenHeader,
  Txt,
} from '@components';
import {MAX_CONTACTS, useEmergencyContacts} from '@features/profile';
import {tokens} from '@theme';
import {useNavigation} from '@react-navigation/native';

const {colors, space, radius} = tokens;

const PHONE = /^\+?[0-9 ]{8,16}$/;

// Figma "Confirm recipient + Contacts", reused as people to tell after an SOS.
const EmergencyContactsScreen = () => {
  const {goBack} = useNavigation();
  const {contacts, add, remove} = useEmergencyContacts();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<{name?: string; phone?: string}>();

  const handleChange = useCallback((value: string, field: string) => {
    field === 'name' ? setName(value) : setPhone(value);
    setError(undefined);
  }, []);

  const handleAdd = useCallback(async () => {
    const next = {
      name: name.trim() ? undefined : 'Enter a name.',
      phone: PHONE.test(phone.trim()) ? undefined : 'Enter a valid phone number.',
    };
    if (next.name || next.phone) {
      setError(next);
      return;
    }
    await add(name, phone);
    setName('');
    setPhone('');
  }, [add, name, phone]);

  const handleRemove = useCallback(
    (id: string, who: string) =>
      Alert.alert('Remove contact', `Remove ${who} from emergency contacts?`, [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Remove', style: 'destructive', onPress: () => remove(id)},
      ]),
    [remove],
  );

  const full = contacts.length >= MAX_CONTACTS;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader
        title="Emergency contacts"
        subtitle="After you send an SOS, we offer to text them your location."
        onBack={goBack}
      />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled">
        {contacts.length > 0 ? (
          <View style={styles.card}>
            {contacts.map(c => (
              <View key={c.id} style={styles.contact}>
                <Avatar name={c.name} size={40} />
                <View style={styles.flex}>
                  <ListRow
                    title={c.name}
                    subtitle={c.phone}
                    right={
                      <AppButton
                        label="Remove"
                        variant="ghost"
                        onPress={() => handleRemove(c.id, c.name)}
                      />
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Txt variant="body" color={colors.textMuted} center>
              No contacts yet. Add a family member or friend.
            </Txt>
          </View>
        )}

        {full ? (
          <Txt variant="caption" color={colors.textMuted}>
            You can save up to {MAX_CONTACTS} contacts.
          </Txt>
        ) : (
          <View style={styles.form}>
            <Txt variant="heading">Add a contact</Txt>
            <CustomInput
              field="name"
              title="Name"
              value={name}
              maxLength={40}
              placeholder="E.g. Mom"
              onChangeText={handleChange}
              errorMessage={error?.name}
            />
            <CustomInput
              field="phone"
              title="Phone number"
              value={phone}
              maxLength={16}
              inputMode="tel"
              placeholder="+84 912 345 678"
              onChangeText={handleChange}
              errorMessage={error?.phone}
            />
            <AppButton label="Add contact" onPress={handleAdd} />
          </View>
        )}

        <Txt variant="caption" color={colors.textMuted}>
          Contacts are saved only on this phone. Texts are sent from your own
          SMS app, and only when you press Send there.
        </Txt>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmergencyContactsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  body: {padding: space.xl, rowGap: space.xl},
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  contact: {flexDirection: 'row', alignItems: 'center', paddingLeft: space.lg},
  flex: {flex: 1},
  empty: {
    padding: space.xl,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  form: {rowGap: space.lg},
});
