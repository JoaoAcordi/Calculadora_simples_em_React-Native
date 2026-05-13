import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const hieroglyphMap = {
  '0': '𓄤', // Nefer (often used to represent zero/nothingness)
  '1': '𓏺',
  '2': '𓏻',
  '3': '𓏼',
  '4': '𓏽',
  '5': '𓏾',
  '6': '𓏿',
  '7': '𓐀',
  '8': '𓐁',
  '9': '𓐂',
  '.': '𓍯', // Shen or dot equivalent
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B8860B', // Dark Goldenrod
    background: '#FDF5E6', // Old Lace (papyrus feel)
    surface: '#FDF5E6',
    onSurface: '#3E2723',
  },
};

const toHieroglyph = (text) => {
  if (text == null) return '';
  return String(text).split('').map(char => hieroglyphMap[char] || char).join('');
};

export default function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState('');
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNum = (num) => {
    if (waitingForNewValue) {
      setDisplayValue(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(num) : displayValue + num);
    }
  };

  const handleOp = (op) => {
    if (operator && !waitingForNewValue) {
      calculate();
    } else {
      setFirstValue(displayValue);
    }
    setOperator(op);
    setWaitingForNewValue(true);
  };

  const calculate = () => {
    if (!operator || !firstValue) return;

    const a = parseFloat(firstValue);
    const b = parseFloat(displayValue);
    let result = 0;

    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b !== 0 ? a / b : 'Erro'; break;
      default: return;
    }

    if (result === 'Erro') {
      setDisplayValue(result);
    } else {
      // Limit decimals
      let formattedResult = parseFloat(result.toFixed(10));
      setDisplayValue(String(formattedResult));
      setFirstValue(String(formattedResult));
    }
    
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstValue('');
    setWaitingForNewValue(false);
  };

  const renderButton = (label, onPress, isAction = false, isOp = false) => {
    let mode = 'elevated';
    let buttonColor = undefined;
    let textColor = undefined;

    if (isAction) {
      mode = 'contained';
      buttonColor = '#CD853F'; // Peru color
      textColor = '#FFFFFF';
    } else if (isOp) {
      mode = 'contained-tonal';
      buttonColor = '#DEB887'; // Burlywood
      textColor = '#3E2723';
    } else {
      buttonColor = '#FFF8DC'; // Cornsilk
      textColor = '#3E2723';
    }
    
    const displayLabel = toHieroglyph(label);
    
    return (
      <Button 
        mode={mode} 
        onPress={() => onPress(label)} 
        style={styles.button}
        labelStyle={[styles.buttonText, { color: textColor }]}
        buttonColor={buttonColor}
        contentStyle={styles.buttonContent}
      >
        {displayLabel}
      </Button>
    );
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>Calculadora Hieróglifo</Text>
          </View>

          <View style={styles.displayContainer}>
            <Text style={styles.historyText} variant="headlineSmall">
               {firstValue ? toHieroglyph(firstValue) + ' ' + (operator || '') : ''}
            </Text>
            <Text style={styles.displayText} variant="displayLarge" numberOfLines={1} adjustsFontSizeToFit>
              {toHieroglyph(displayValue)}
            </Text>
          </View>
          
          <View style={styles.keypad}>
            <View style={styles.row}>
              {renderButton('7', handleNum)}
              {renderButton('8', handleNum)}
              {renderButton('9', handleNum)}
              {renderButton('/', handleOp, false, true)}
            </View>
            <View style={styles.row}>
              {renderButton('4', handleNum)}
              {renderButton('5', handleNum)}
              {renderButton('6', handleNum)}
              {renderButton('*', handleOp, false, true)}
            </View>
            <View style={styles.row}>
              {renderButton('1', handleNum)}
              {renderButton('2', handleNum)}
              {renderButton('3', handleNum)}
              {renderButton('-', handleOp, false, true)}
            </View>
            <View style={styles.row}>
              {renderButton('C', handleClear, true)}
              {renderButton('0', handleNum)}
              {renderButton('=', calculate, true)}
              {renderButton('+', handleOp, false, true)}
            </View>
          </View>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6', // Old Lace
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#EED9B2', // Light gold/sand
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  displayText: {
    fontSize: 56,
    color: '#3E2723',
    textAlign: 'right',
  },
  historyText: {
    color: '#8B4513',
    marginBottom: 10,
    textAlign: 'right',
    minHeight: 32,
  },
  keypad: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEB887',
  },
  buttonContent: {
    height: 70,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
