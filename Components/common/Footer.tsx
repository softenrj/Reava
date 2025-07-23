import React from 'react'
import { Text, View } from 'tamagui'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <View
      borderTopWidth={1}
      borderTopColor="#e1e2e38c"
      alignItems="center"
      justifyContent="center"
      marginHorizontal={48}
    >
      <Text fontSize={14} color="#0000008d" marginBottom={'$3'}>
        © {year} Reava. All rights reserved.
      </Text>
    </View>
  )
}
