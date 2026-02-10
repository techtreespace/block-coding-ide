import { pythonGenerator, Order } from 'blockly/python';

// GPIO 블록 코드 생성
pythonGenerator.forBlock['gpio_led'] = function(block) {
  const state = block.getFieldValue('STATE');
  const pin = block.getFieldValue('PIN');
  const code = `Pin(${pin}, Pin.OUT).value(${state})\n`;
  return code;
};

pythonGenerator.forBlock['gpio_digital_write'] = function(block) {
  const pin = pythonGenerator.valueToCode(block, 'PIN', Order.ATOMIC) || '0';
  const value = pythonGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
  const code = `Pin(${pin}, Pin.OUT).value(${value})\n`;
  return code;
};

pythonGenerator.forBlock['gpio_digital_read'] = function(block) {
  const pin = block.getFieldValue('PIN');
  const code = `Pin(${pin}, Pin.IN).value()`;
  return [code, Order.ATOMIC];
};

pythonGenerator.forBlock['gpio_pwm'] = function(block) {
  const pin = pythonGenerator.valueToCode(block, 'PIN', Order.ATOMIC) || '0';
  const duty = pythonGenerator.valueToCode(block, 'DUTY', Order.ATOMIC) || '512';
  const code = `PWM(Pin(${pin})).duty(${duty})\n`;
  return code;
};

// 센서 블록 코드 생성
pythonGenerator.forBlock['sensor_dht'] = function(block) {
  const type = block.getFieldValue('TYPE');
  const pin = block.getFieldValue('PIN');
  const measure = type === 'temperature' ? 'temperature()' : 'humidity()';
  const code = `dht.DHT22(Pin(${pin})).${measure}`;
  return [code, Order.ATOMIC];
};

pythonGenerator.forBlock['sensor_ultrasonic'] = function(block) {
  const trig = block.getFieldValue('TRIG');
  const echo = block.getFieldValue('ECHO');
  // 초음파 센서 거리 측정 함수 (간단한 구현)
  const code = `ultrasonic_distance(${trig}, ${echo})`;
  return [code, Order.ATOMIC];
};

pythonGenerator.forBlock['sensor_button'] = function(block) {
  const pin = block.getFieldValue('PIN');
  const code = `Pin(${pin}, Pin.IN, Pin.PULL_UP).value() == 0`;
  return [code, Order.ATOMIC];
};

// 액추에이터 블록 코드 생성
pythonGenerator.forBlock['actuator_servo'] = function(block) {
  const pin = block.getFieldValue('PIN');
  const angle = pythonGenerator.valueToCode(block, 'ANGLE', Order.ATOMIC) || '90';
  const code = `servo_${pin}.write_angle(${angle})\n`;
  return code;
};

pythonGenerator.forBlock['actuator_buzzer'] = function(block) {
  const pin = block.getFieldValue('PIN');
  const freq = pythonGenerator.valueToCode(block, 'FREQ', Order.ATOMIC) || '1000';
  const duration = pythonGenerator.valueToCode(block, 'DURATION', Order.ATOMIC) || '500';
  const code = `buzzer(${pin}, ${freq}, ${duration})\n`;
  return code;
};

// 제어 블록 코드 생성
pythonGenerator.forBlock['control_delay'] = function(block) {
  const time = block.getFieldValue('TIME');
  const code = `sleep_ms(${time})\n`;
  return code;
};

pythonGenerator.forBlock['control_print'] = function(block) {
  const text = pythonGenerator.valueToCode(block, 'TEXT', Order.ATOMIC) || '""';
  const code = `print(${text})\n`;
  return code;
};

// 헬퍼 함수들을 포함하는 초기 코드
export function getInitialCode() {
  return `# MicroPython Code
from machine import Pin, PWM
from time import sleep, sleep_ms
import dht

# 초음파 센서 거리 측정 함수
def ultrasonic_distance(trig_pin, echo_pin):
    trig = Pin(trig_pin, Pin.OUT)
    echo = Pin(echo_pin, Pin.IN)
    trig.value(0)
    sleep_ms(2)
    trig.value(1)
    sleep_ms(10)
    trig.value(0)
    
    while echo.value() == 0:
        pass
    start = time.ticks_us()
    
    while echo.value() == 1:
        pass
    end = time.ticks_us()
    
    duration = time.ticks_diff(end, start)
    distance = (duration * 0.0343) / 2
    return distance

# 부저 함수
def buzzer(pin, freq, duration):
    pwm = PWM(Pin(pin))
    pwm.freq(freq)
    pwm.duty(512)
    sleep_ms(duration)
    pwm.duty(0)

# 서보모터 클래스들 초기화는 setup()에서

def setup():
    pass

def loop():
`;
}

export function wrapCode(userCode) {
  const init = getInitialCode();
  const indent = '    ';
  const indentedCode = userCode.split('\n')
    .map(line => line ? indent + line : line)
    .join('\n');
  
  return `${init}${indentedCode}

# 메인 실행
setup()
while True:
    loop()
`;
}
