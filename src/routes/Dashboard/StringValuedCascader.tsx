import {Cascader, CascaderProps} from "antd";
import {useState, PropsWithChildren} from "react";

export default function StringValuedCascader(props: Omit<PropsWithChildren<CascaderProps>, 'onChange'> & {
  onChange?: (alg: Array<string>) => void;
}) {
  const [value, setValue] = useState((props.value as Array<string> ?? []).map((alg) => {
    if (alg === 'default') {
      return ['default'];
    } else if (['node distance', 'node position', 'link length', 'link direction'].includes(alg)) {
      return ['restrict strategies', alg];
    } else {
      return ['restrict algorithms', alg];
    }
  }));

  const onSingleChange: (value: any[]) => void = (value) => {
    setValue(value);
    console.log(value)
    props.onChange?.(value.map(arr => {
      return arr[arr.length - 1];
    }));
  }

  return (
    <Cascader
      {...props}
      value={value}
      onChange={onSingleChange}
      showCheckedStrategy={Cascader.SHOW_CHILD}
    ></Cascader>
  )
}