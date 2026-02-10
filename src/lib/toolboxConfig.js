export const toolboxConfig = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '제어',
      colour: '120',
      contents: [
        {
          kind: 'block',
          type: 'controls_if'
        },
        {
          kind: 'block',
          type: 'controls_repeat_ext'
        },
        {
          kind: 'block',
          type: 'controls_whileUntil'
        },
        {
          kind: 'block',
          type: 'control_delay'
        },
        {
          kind: 'block',
          type: 'control_print'
        }
      ]
    },
    {
      kind: 'category',
      name: 'GPIO',
      colour: '230',
      contents: [
        {
          kind: 'block',
          type: 'gpio_led'
        },
        {
          kind: 'block',
          type: 'gpio_digital_write'
        },
        {
          kind: 'block',
          type: 'gpio_digital_read'
        },
        {
          kind: 'block',
          type: 'gpio_pwm'
        }
      ]
    },
    {
      kind: 'category',
      name: '센서',
      colour: '160',
      contents: [
        {
          kind: 'block',
          type: 'sensor_button'
        },
        {
          kind: 'block',
          type: 'sensor_dht'
        },
        {
          kind: 'block',
          type: 'sensor_ultrasonic'
        }
      ]
    },
    {
      kind: 'category',
      name: '액추에이터',
      colour: '290',
      contents: [
        {
          kind: 'block',
          type: 'actuator_servo'
        },
        {
          kind: 'block',
          type: 'actuator_buzzer'
        }
      ]
    },
    {
      kind: 'category',
      name: '논리',
      colour: '210',
      contents: [
        {
          kind: 'block',
          type: 'logic_compare'
        },
        {
          kind: 'block',
          type: 'logic_operation'
        },
        {
          kind: 'block',
          type: 'logic_negate'
        },
        {
          kind: 'block',
          type: 'logic_boolean'
        }
      ]
    },
    {
      kind: 'category',
      name: '수학',
      colour: '230',
      contents: [
        {
          kind: 'block',
          type: 'math_number'
        },
        {
          kind: 'block',
          type: 'math_arithmetic'
        },
        {
          kind: 'block',
          type: 'math_single'
        },
        {
          kind: 'block',
          type: 'math_number_property'
        }
      ]
    },
    {
      kind: 'category',
      name: '변수',
      colour: '330',
      custom: 'VARIABLE'
    },
    {
      kind: 'category',
      name: '함수',
      colour: '290',
      custom: 'PROCEDURE'
    }
  ]
};
