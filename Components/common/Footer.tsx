import React from 'react'
import { Text, View } from 'tamagui'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <View
      borderTopWidth={1}
      borderTopColor="#e1e2e3"
      paddingVertical={'$2'}
      alignItems="center"
      justifyContent="center"
      marginHorizontal={32}
      marginTop={12}
    >
      <Text fontSize={14} color="#555" marginBottom={'$3'}>
        © {year} Reava. All rights reserved.
      </Text>
    </View>
  )
}
