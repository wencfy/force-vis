import React, {useState} from "react";
import {Button, Col, Collapse, Form, Input, Select, Space} from "antd";
import {CaretRightOutlined} from '@ant-design/icons';
import {ControlBoardWrapper, EditViewWrapper} from "./style";
import {DashboardPanel, deepClone} from "../../utils";
import {Add, Delete, FilterAlt, Settings} from "@styled-icons/material-outlined";
import {ColorPicker, GridPanel, NodeGraph} from "../../components";

const {Panel} = Collapse;

const options: Record<string, string> = {
  "GT": ">",
  "LT": "<",
  "GE": ">=",
  "LE": "<=",
  "EQ": "="
}

const EditView: React.FC<{
  editPanel: DashboardPanel
}> = function (
  {
    editPanel
  }
) {
  const [panel, setPanel] = useState(deepClone(editPanel));
  const [form] = Form.useForm();

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
          >
            <NodeGraph
              {...panel}
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
                </Panel>
                <Panel key='2' header='Node Options'>
                  Rules
                  <Form.List name={['nodeOptions', 'rules']}>
                    {(fields, {add, remove}) => (
                      <>
                        {fields.map((field, index) => {
                          return <div key={field.key}>
                            <Space align="baseline">
                              <Form.Item>
                                <FilterAlt size={18}/>
                              </Form.Item>
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
                                <Select size='small' style={{width: 50}}>
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
                              <Form.Item>
                                <Button
                                  type='text'
                                  icon={<Delete size={18} onClick={() => remove(field.name)} />} />
                              </Form.Item>
                            </Space>
                            <br/>
                            <Space align="baseline">
                              <Form.Item>
                                <Settings size={18} />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, 'config', 'lColor']}>
                                <ColorPicker />
                              </Form.Item>
                            </Space>
                          </div>
                        })}
                        <Form.Item>
                          <Button
                            type="dashed"
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

                </Panel>
              </Collapse>
            </Form>
          </ControlBoardWrapper>
          {/*<button onClick={() => {console.log(form.getFieldValue([]))}}>click</button>*/}
        </Col>
      </EditViewWrapper>
    </>
  );
}

export default EditView;