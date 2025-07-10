import React from 'react'
import { Text, View } from 'tamagui'

export default function ShowToast({title, message, duration = 50, varient = 'success'}: {title: string, message?: string, duration?: number, varient?: 'success'| 'error'| 'info'}) {
    const bg = () => {
        switch (varient) {
            case 'success':
                return 'green-500'
            case 'error':
                return 'red-500'
            case 'info':
                return 'blue-500'
            default: 
                return 'green-500'
        }
    }
  return (
    <View background={bg()} position='absolute' zIndex={999} top={0} >
        <Text>Hello</Text>
    </View>
  )
}
