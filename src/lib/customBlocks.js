import * as Blockly from 'blockly';

// GPIO 카테고리 블록들
export const gpioBlocks = {
  // LED 제어 블록
  'gpio_led': {
    init: function() {
      this.appendDummyInput()
        .appendField("LED")
        .appendField(new Blockly.FieldDropdown([
          ["켜기", "1"],
          ["끄기", "0"]
        ]), "STATE")
        .appendField("핀")
        .appendField(new Blockly.FieldNumber(2, 0, 40), "PIN");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("LED를 켜거나 끕니다");
      this.setHelpUrl("");
    }
  },

  // 디지털 출력 블록
  'gpio_digital_write': {
    init: function() {
      this.appendValueInput("PIN")
        .setCheck("Number")
        .appendField("디지털 출력 핀");
      this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField("값");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("디지털 핀에 HIGH(1) 또는 LOW(0) 출력");
    }
  },

  // 디지털 입력 블록
  'gpio_digital_read': {
    init: function() {
      this.appendDummyInput()
        .appendField("디지털 입력 핀")
        .appendField(new Blockly.FieldNumber(4, 0, 40), "PIN");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("디지털 핀의 값을 읽습니다 (0 또는 1)");
    }
  },

  // PWM 출력 블록
  'gpio_pwm': {
    init: function() {
      this.appendValueInput("PIN")
        .setCheck("Number")
        .appendField("PWM 출력 핀");
      this.appendValueInput("DUTY")
        .setCheck("Number")
        .appendField("밝기 (0-1023)");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("PWM으로 LED 밝기 조절 등");
    }
  }
};

// 센서 블록들
export const sensorBlocks = {
  // DHT 온습도 센서
  'sensor_dht': {
    init: function() {
      this.appendDummyInput()
        .appendField("DHT 센서")
        .appendField(new Blockly.FieldDropdown([
          ["온도", "temperature"],
          ["습도", "humidity"]
        ]), "TYPE")
        .appendField("핀")
        .appendField(new Blockly.FieldNumber(4, 0, 40), "PIN");
      this.setOutput(true, "Number");
      this.setColour(160);
      this.setTooltip("DHT11/DHT22 온습도 센서 읽기");
    }
  },

  // 초음파 센서
  'sensor_ultrasonic': {
    init: function() {
      this.appendDummyInput()
        .appendField("초음파 센서 거리(cm)")
        .appendField("Trig 핀")
        .appendField(new Blockly.FieldNumber(5, 0, 40), "TRIG")
        .appendField("Echo 핀")
        .appendField(new Blockly.FieldNumber(18, 0, 40), "ECHO");
      this.setOutput(true, "Number");
      this.setColour(160);
      this.setTooltip("HC-SR04 초음파 센서로 거리 측정");
    }
  },

  // 버튼 블록
  'sensor_button': {
    init: function() {
      this.appendDummyInput()
        .appendField("버튼 눌림 핀")
        .appendField(new Blockly.FieldNumber(0, 0, 40), "PIN");
      this.setOutput(true, "Boolean");
      this.setColour(160);
      this.setTooltip("버튼이 눌렸는지 확인");
    }
  }
};

// 액추에이터 블록들
export const actuatorBlocks = {
  // 서보모터
  'actuator_servo': {
    init: function() {
      this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField("서보모터 핀")
        .appendField(new Blockly.FieldNumber(9, 0, 40), "PIN")
        .appendField("각도");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("서보모터를 지정된 각도로 회전 (0-180)");
    }
  },

  // 부저
  'actuator_buzzer': {
    init: function() {
      this.appendValueInput("FREQ")
        .setCheck("Number")
        .appendField("부저 핀")
        .appendField(new Blockly.FieldNumber(23, 0, 40), "PIN")
        .appendField("주파수");
      this.appendValueInput("DURATION")
        .setCheck("Number")
        .appendField("지속시간(ms)");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("부저 소리 재생");
    }
  }
};

// 제어 블록들
export const controlBlocks = {
  // 지연
  'control_delay': {
    init: function() {
      this.appendDummyInput()
        .appendField("기다리기")
        .appendField(new Blockly.FieldNumber(1000, 0), "TIME")
        .appendField("밀리초");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("지정된 시간만큼 대기 (1000ms = 1초)");
    }
  },

  // 시리얼 출력
  'control_print': {
    init: function() {
      this.appendValueInput("TEXT")
        .appendField("출력");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("시리얼 모니터에 출력");
    }
  }
};

// 모든 블록 등록
export function registerCustomBlocks() {
  Object.keys(gpioBlocks).forEach(blockName => {
    Blockly.Blocks[blockName] = gpioBlocks[blockName];
  });
  
  Object.keys(sensorBlocks).forEach(blockName => {
    Blockly.Blocks[blockName] = sensorBlocks[blockName];
  });
  
  Object.keys(actuatorBlocks).forEach(blockName => {
    Blockly.Blocks[blockName] = actuatorBlocks[blockName];
  });
  
  Object.keys(controlBlocks).forEach(blockName => {
    Blockly.Blocks[blockName] = controlBlocks[blockName];
  });
}
