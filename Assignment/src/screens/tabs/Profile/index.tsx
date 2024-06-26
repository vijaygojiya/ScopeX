import {View} from 'react-native';
import React from 'react';
import {TabScreensProps} from '../../../types/navigation';
import {AppButton} from '../../../components';
import {Auth} from '../../../services';

const Profile = ({}: TabScreensProps<'Profile'>) => {
  return (
    <View>
      <AppButton title="Logout" onPress={Auth.signOut} />
    </View>
  );
};

export default Profile;
