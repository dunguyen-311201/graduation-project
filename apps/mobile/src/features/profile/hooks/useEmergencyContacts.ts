import {Linking, Platform} from 'react-native';
import {useCallback} from 'react';

import {externalMapUrl} from '@constants';
import {Location} from '@types';
import useDeviceStore from './useDeviceStore';

export type EmergencyContact = {id: string; name: string; phone: string};

export const MAX_CONTACTS = 5;

const useEmergencyContacts = () => {
  const {value: contacts, save, ready} = useDeviceStore<EmergencyContact[]>(
    'emergency-contacts',
    [],
  );

  const add = useCallback(
    (name: string, phone: string) =>
      save([
        ...contacts,
        {id: `${Date.now()}`, name: name.trim(), phone: phone.trim()},
      ]),
    [contacts, save],
  );

  const remove = useCallback(
    (id: string) => save(contacts.filter(c => c.id !== id)),
    [contacts, save],
  );

  // Opens the SMS app with every contact and a map link filled in. The user
  // still presses Send, so nothing goes out without them seeing it.
  const alertContacts = useCallback(
    (location?: Location | null) => {
      if (contacts.length === 0) {
        return;
      }
      const where = location
        ? ` I am at ${location.description || 'this location'}: ${externalMapUrl(
            location.latitude,
            location.longitude,
          )}`
        : '';
      const body = encodeURIComponent(
        `I sent an SOS request for roadside help.${where}`,
      );
      const to = contacts
        .map(c => c.phone)
        .join(Platform.OS === 'ios' ? ',' : ';');
      const sep = Platform.OS === 'ios' ? '&' : '?';
      Linking.openURL(`sms:${to}${sep}body=${body}`);
    },
    [contacts],
  );

  return {contacts, add, remove, alertContacts, ready};
};

export default useEmergencyContacts;
