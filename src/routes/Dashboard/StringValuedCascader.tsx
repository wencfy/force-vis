import {Cascader, CascaderProps} from "antd";
import {useState, PropsWithChildren} from "react";

export default function StringValuedCascader(props: Omit<PropsWithChildren<CascaderProps<any>>, 'onChange'> & {
  onChange?: (alg: string) => void;
}) {
  const [value, setValue] = useState(props.value);

  const onSingleChange: (value: any[]) => void = (value) => {
    setValue(value);
    props.onChange?.(value[value.length - 1]);
  }

  return (
    <Cascader
      {...props}
      value={value}
      onChange={onSingleChange}
    ></Cascader>
  )
}