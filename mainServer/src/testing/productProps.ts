export default [
  {
    propName: 'SPL',
    description: 'Presion sonora en decibeles (dB)',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/Sound-loud.svg',
    iconDescription: 'altavoz con ondas de sonido saliendo de el',
    displayName: {
      default: 'SPL',
    },
    placeholder: {
      default: '115 dB',
    },
    lookupNames: {
      spanish: ['SPL', 'presión sonora', 'presión acústica', 'potencia', 'volumen', 'decibeles', 'dB', 'sonido', 'ruido', 'intensidad']
    }
  },
  {
    propName: 'battery',
    description: 'Duración de la batería en horas',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/Battery-6-bar.svg',
    iconDescription: 'batería',
    displayName: {
      default: '',
    },
    placeholder: {
      default: '12 hours',
      spanish: '12 horas'
    },
    lookupNames: {
      spanish: ['batería', 'pila', 'autonomía', 'duración', 'carga', 'tiempo', 'horas', 'energía', 'capacidad', 'mAh'],
    }
  },
  {
    propName: 'bluetooth',
    description: 'Funcionalidad de conexión inalámbrica a traves de bluetooth',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/Bluetooth.svg',
    iconDescription: 'bluetooth',
    displayName: {
      default: 'BT',
    },
    placeholder: {
      default: '',
    },
    lookupNames: {
      spanish: ['bluetooth', 'inalámbrico', 'conexión']
    }
  },
  {
    propName: 'speakerDriverSize',
    description: 'Tamaño del driver y woofer del altavoz',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/Speaker.svg',
    iconDescription: 'altavoz con woofer y driver',
    displayName: {
      default: '',
    },
    placeholder: {
      default: '8" - 1"',
    },
    lookupNames: {
      spanish: ['tamaño del driver', 'driver', 'altavoz', 'tamaño', 'diámetro', 'pulgadas']
    }
  },
  {
    propName: 'power',
    description: 'Potencia en watts del dispositivo, normalmente el valor mas relevante de este',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/Electric-bolt.svg',
    iconDescription: 'relámpago',
    displayName: {
      default: '',
    },
    placeholder: {
      default: '200 W',
    },
    lookupNames: {
      spanish: ['potencia', 'watts', 'w', 'consumo', 'energía', 'voltaje', 'amperaje', 'corriente']
    }
  },
  {
    propName: 'frequencyResponse',
    description: 'Rango de frecuencia en el que el dispositivo es capaz de operar',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/audio-spectrum.svg',
    iconDescription: 'espectro de frecuencias',
    displayName: {
      default: '',
    },
    placeholder: {
      default: '20 Hz - 20 kHz',
    },
    lookupNames: {
      spanish: ['respuesta en frecuencia', 'frecuencia', 'hertz', 'Hz', 'rango', 'frecuencias']
    }
  },
  {
    propName: 'wireless', 
    description: 'Conexión inalámbrica del dispositivo, no confundir con bluetooth, este es un término mas general',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/Wifi.svg',
    iconDescription: 'wifi (3 ondas)',
    displayName: {
      default: 'Wireless',
      spanish: 'Inalámbrico'
    },
    placeholder: {
      default: '',
    },
    lookupNames: {
      spanish: ['inalámbrico', 'wireless', 'wifi', 'conexión']
    }
  },
  {
    propName: 'weight',
    description: 'Peso del dispositivo en gramos o kilogramos (g, kg)',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/Weight.svg',
    iconDescription: 'pesa de bascula',
    displayName: {
      default: '',
    },
    placeholder: {
      default: '200g',
    },
    lookupNames: {
      spanish: ['peso', 'gramos', 'kilos', 'pesado']
    }
  },
  {
    propName: 'lumens',
    description: 'Cantidad de luz emitida por el dispositivo en lúmenes',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/sun-icon.svg',
    iconDescription: 'sol',
    displayName: {
      default: '',
    },
    placeholder: {
      default: '2000 lux',
    },
    lookupNames: {
      spanish: ['lúmenes', 'luz', 'iluminación', 'lux', 'brillo']
    }
  },
  {
    propName: 'phantomPower',
    description: 'Capacidad de alimentar un micrófono de condensador (phantom power)',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/phantom-power.svg',
    iconDescription: 'fantasma con relámpago',
    displayName: {
      default: 'Phantom Power',
    },
    placeholder: {
      default: '',
    },
    lookupNames: {
      spanish: ['phantom power', 'alimentación', 'condensador', 'micrófono']
    }
  },
  {
    propName: 'polarPattern',
    description: 'Patrón polar del micrófono',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/polarPattern.svg',
    iconDescription: 'patrón polar',
    displayName: {
      default: '',
    },
    placeholder: {
      default: 'Cardioide',
    },
    lookupNames: {
      spanish: ['patrón polar', 'micrófono', 'cardioide', 'omnidireccional', 'bidireccional']
    }
  },
  {
    propName: 'liquidCapacity',
    description: 'Capacidad de liquido que puede contener un dispositivo',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/measuring-cup.svg',
    iconDescription: 'vaso medidor',
    displayName: {
      default: '',
    },
    placeholder: {
      default: '1L',
    },
    lookupNames: {
      spanish: ['capacidad', 'litros', 'mililitros', 'agua', 'líquido']
    }
  },
  {
    propName: 'distance',
    description: 'Distancia en metros, o largo de un dispositivo',
    icon: 'https://soundpro-files.s3.eu-west-3.amazonaws.com/public/prop-icons/distance.svg',
    iconDescription: 'palo con flechas a cada extremo',
    displayName: {
      default: '',
    },
    placeholder: {
      default: '10m',
    },
    lookupNames: {
      spanish: ['distancia', 'metros', 'longitud', 'largo', 'ancho', 'alto']
    }
  }
  
]