import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {CustomInput, CustomModal} from '@components';
import {DARK_GRAY_COLOR} from '@theme';
import {TUser} from '@types';
import useAuth from '@hooks/useAuth';

const UpgradeForm = ({
  user,
  handleClose,
}: {
  user: TUser;
  handleClose: () => void;
}) => {
  const [data, setData] = useState<TUser>(user);

  const {upgrade} = useAuth();

  const handleChangeInput = useCallback((value: string, field: string) => {
    setData(prev => ({...prev, [field]: value}));
  }, []);

  const handleUpgrade = useCallback(async (service: TUser) => {
    await upgrade(service);
    handleClose();
  }, []);

  return (
    <CustomModal onClose={handleClose} onOk={handleUpgrade}>
      <View style={styles.content}>
        <CustomInput
          title="Name"
          value={data?.displayName}
          editable={false}
          field=""
          border
          valueStyle={styles.input}
        />

        <CustomInput
          title="Phone Number"
          value={data?.phoneNumber}
          editable={false}
          field=""
          border
          valueStyle={styles.input}
        />

        <CustomInput
          title="Email"
          value={data?.email || ''}
          editable={true}
          field="email"
          inputMode="email"
          border
          valueStyle={styles.input}
          onChangeText={handleChangeInput}
        />

        <CustomInput
          title="Citizen Identification"
          value={data?.citizenIdentification}
          editable={true}
          field="citizenIdentification"
          inputMode="numeric"
          maxLength={12}
          border
          onChangeText={handleChangeInput}
          valueStyle={styles.input}
        />
      </View>
    </CustomModal>
  );
};

export default UpgradeForm;

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
  },
  input: {
    color: DARK_GRAY_COLOR,
  },
});
