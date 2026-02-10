import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { toolboxConfig } from '../../lib/toolboxConfig';
import { registerCustomBlocks } from '../../lib/customBlocks';
import { wrapCode } from '../../lib/codeGenerator';

const BlockEditor = ({ onCodeChange }) => {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    // 커스텀 블록 등록
    registerCustomBlocks();

    // Blockly 워크스페이스 초기화
    if (blocklyDiv.current && !workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxConfig,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true,
        scrollbars: true,
        sounds: true,
        theme: Blockly.Themes.Classic
      });

      // 초기 샘플 블록 추가
      const xml = Blockly.utils.xml.textToDom(`
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="controls_repeat_ext" x="20" y="20">
            <value name="TIMES">
              <shadow type="math_number">
                <field name="NUM">10</field>
              </shadow>
            </value>
            <statement name="DO">
              <block type="gpio_led">
                <field name="STATE">1</field>
                <field name="PIN">2</field>
                <next>
                  <block type="control_delay">
                    <field name="TIME">500</field>
                    <next>
                      <block type="gpio_led">
                        <field name="STATE">0</field>
                        <field name="PIN">2</field>
                        <next>
                          <block type="control_delay">
                            <field name="TIME">500</field>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </xml>
      `);
      Blockly.Xml.domToWorkspace(xml, workspaceRef.current);

      // 워크스페이스 변경 감지
      workspaceRef.current.addChangeListener(() => {
        const code = pythonGenerator.workspaceToCode(workspaceRef.current);
        const wrappedCode = wrapCode(code);
        onCodeChange(wrappedCode);
      });

      // 초기 코드 생성
      const initialCode = pythonGenerator.workspaceToCode(workspaceRef.current);
      onCodeChange(wrapCode(initialCode));
    }

    // 윈도우 리사이즈 핸들러
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div 
        ref={blocklyDiv} 
        className="h-full w-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default BlockEditor;
