import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 72 }: LogoProps) {
  return (
    <View
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
        },
      ]}
    >
      <Image
        source={require('../../assets/logo.jpeg')} 
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
        }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Ensures rounded corners are applied to the image
  },
});