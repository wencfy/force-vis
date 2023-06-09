import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  theme,
} from "antd";
import {CaretRightOutlined} from '@ant-design/icons';
import {Add, Delete, FilterAlt, Settings} from "@styled-icons/material-outlined";
import {ActionWrapper, ControlBoardWrapper, EditViewWrapper, FilterWrapper, RuleWrapper} from "./style";

import {DashboardPanel, Datasource, db, deepClone} from "../../utils";
import {ColorPicker, GridPanel, NodeGraph} from "../../components";
import StringValuedCascader from "./StringValuedCascader";

const {Panel} = Collapse;

const options: Record<string, string> = {
  "GT": ">",
  "LT": "<",
  "GE": ">=",
  "LE": "<=",
  "EQ": "="
};

const algorithms = [
  {
    value: "default",
    label: "default",
  },
  {
    value: "restrict algorithms",
    label: "restrict algorithms",
    children: [
      {
        value: "markov mobility",
        label: "markov mobility"
      },
      {
        value: "degree mobility",
        label: "degree mobility"
      },
      {
        value: "age mobility",
        label: "age mobility"
      },
      {
        value: "pinning weight mobility",
        label: "pinning weight mobility"
      },
    ],
  },
  {
    value: "restrict strategies",
    label: "restrict strategies",
    children: [
      {
        value: "node distance",
        label: "node distance"
      },
      {
        value: "node position",
        label: "node position"
      },
      {
        value: "link length",
        label: "link length"
      },
      {
        value: "link direction",
        label: "link direction"
      }
    ]
  }
];

const EditView: React.FC<{
  editPanel: DashboardPanel,
  updatePanel: ({id, newPanel, toDb}: { id: string, newPanel?: DashboardPanel, toDb?: boolean }) => void
}> = function (
  {
    editPanel,
    updatePanel
  }
) {
  const [panel, setPanel] = useState(deepClone(editPanel));
  const [dsList, setDsList] = useState<Array<{ label: string, value: string }>>([]);
  const [form] = Form.useForm();
  const token = theme.useToken().token;
  const navigator = useNavigate();

  useEffect(() => {
    db.data<Datasource, 'getAll'>('datasource', 'getAll').then(res => {
      setDsList(res.map(ds => ({label: ds.name, value: ds.uid})));
    });
  }, []);

  return (
    <>
      <EditViewWrapper>
        <Col span={16}>
          <GridPanel
            style={{height: '100%'}}
            key={panel.id}
            panelInfo={{
              title: panel.panelOptions.title,
              id: panel.id
            }}
            updatePanel={updatePanel}
          >
            <NodeGraph
              {...panel}
              updatePanel={updatePanel}
            />
          </GridPanel>
        </Col>
        <Col span={8}>
          <ControlBoardWrapper>
            <Form
              layout='vertical'
              initialValues={panel}
              form={form}
              onValuesChange={(changedValues, values) => {
                console.log(values);
                setPanel({...panel, ...values});
              }}
            >
              <Collapse
                bordered={false}
                expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0} size={16}/>}
              >
                <Panel key='1' header='Panel Options'>
                  <Form.Item name={['panelOptions', 'title']} label='Title'>
                    <Input/>
                  </Form.Item>
                  <Form.Item name={['panelOptions', 'datasource']} label='Datasource'>
                    <Select options={dsList}/>
                  </Form.Item>
                  <Form.Item name={['panelOptions', 'algorithm']} label='restrictions'>
                    <StringValuedCascader
                      multiple
                      allowClear={false}
                      options={algorithms} />
                  </Form.Item>
                  <Form.Item name={['panelOptions', 'time']} label='time'>
                    <InputNumber />
                  </Form.Item>
                </Panel>
                <Panel key='2' header='Node Options'>
                  <Form.Item
                    label="field name of id"
                    name={['nodeOptions', 'key']}
                  >
                    <Input placeholder="default as name"/>
                  </Form.Item>
                  Rules
                  <Form.List name={['nodeOptions', 'rules']}>
                    {(fields, {add, remove}) => (
                      <>
                        {fields.map((field, index) => {
                          return <RuleWrapper key={field.key}>
                            <FilterWrapper>
                              <FilterAlt size={18}/>
                              <Space.Compact
                                direction="horizontal"
                                size="small"
                              >
                                <Form.Item
                                  name={[field.name, 'fieldName']}
                                >
                                  <Input
                                    size='small'
                                    placeholder='field name'
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={[field.name, 'type']}
                                >
                                  <Select size='small' style={{width: 56}}>
                                    {Object.keys(options).map(option => (
                                      <Select.Option key={option} value={option}>
                                        {options[option]}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  name={[field.name, 'value']}
                                >
                                  <Input size='small'/>
                                </Form.Item>
                              </Space.Compact>
                              <Button
                                type='text'
                                size="small"
                                icon={<Delete size={18} onClick={() => remove(field.name)}/>}/>
                            </FilterWrapper>
                            <Space align="center">
                              <Form.Item>
                                <Settings size={18}/>
                              </Form.Item>

                              <Space.Compact size='small'>
                                <Form.Item
                                  label='Fill Color'
                                  name={[field.name, 'config', 'lColor']}>
                                  <ColorPicker/>
                                </Form.Item>
                                <Form.Item
                                  label='Stroke Color'
                                  name={[field.name, 'config', 'lStroke']}>
                                  <ColorPicker/>
                                </Form.Item>
                                <Form.Item
                                  label='Node Size'
                                  name={[field.name, 'config', 'size']}>
                                  <InputNumber min={1} max={10}/>
                                </Form.Item>
                              </Space.Compact>
                            </Space>
                          </RuleWrapper>
                        })}
                        <Form.Item>
                          <Button
                            type="dashed"
                            size="small"
                            onClick={() => add()}
                            block
                            icon={<Add size={18} style={{marginBottom: 3}}/>}
                          >
                            Add types
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Panel>
                <Panel key='3' header='Link Options'>
                  <Form.Item
                    label="link color"
                    name={['linkOptions', 'key']}
                  >
                  </Form.Item>
                </Panel>
              </Collapse>
            </Form>
            <ActionWrapper color={token.colorFillAlter}>
              <Button
                type='text'
                size='small'
                danger
                onClick={() => navigator(-1)}
              >Discard</Button>
              <Button
                type='text'
                size='small'
              >Save</Button>
              <Button
                type='primary'
                size='small'
                onClick={() => {
                  updatePanel({id: panel.id, newPanel: panel, toDb: true});
                }}
              >Apply</Button>
            </ActionWrapper>
          </ControlBoardWrapper>
        </Col>
      </EditViewWrapper>
    </>
  );
}

export default EditView;