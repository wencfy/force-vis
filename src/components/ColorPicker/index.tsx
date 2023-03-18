import React, {ChangeEvent, useState} from "react";
import {Popover} from "antd";
import {HexAlphaColorPicker} from "react-colorful";
import {ColorPrefix, InputWrapper} from "./style";

export interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = function ({value, onChange}) {
  const [hexColor, setHexColor] = useState(value);

  const onColorChange = (newColor: string) => {
    setHexColor(newColor);
    onChange?.(newColor);
  }

  return (
    <Popover
      content={<HexAlphaColorPicker
        color={hexColor}
        onChange={onColorChange}
      />}
      trigger='click'
      arrow={false}
    >
      <InputWrapper
        prefix={<ColorPrefix
          style={{borderRadius: 2, backgroundColor: hexColor}}
        />}
        size='small'
        placeholder='input color'
        value={hexColor}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onColorChange(event.target.value);
        }}
      />
    </Popover>
  );
}

export default ColorPicker;