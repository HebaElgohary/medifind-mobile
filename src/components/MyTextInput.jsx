import * as React from 'react';
import { TextInput } from 'react-native-paper';
import { mainColor } from '../constants/RootColor';
export const MyTextInput = ( { label, placeholder,value, onChangeText , secureTextEntry , keyboardType} ) => {
  const [text, setText] = React.useState('');

  return (
    <TextInput
        mode="outlined"
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={{ margin: 9 }}
        theme={{
            colors: {
                primary: '#01b3bd',
                onSurfaceVariant: '#939899',
                background:'#ffff'
        },
        roundness: 20,
      }}
          
    />
  );
};
