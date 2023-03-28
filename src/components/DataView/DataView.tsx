import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Tag, Table, Button, Space, Modal, SelectProps, Form, Input, Select, message, theme} from "antd";
import {ColumnsType} from "antd/es/table";
import {AddChart, Delete, Pageview} from "@styled-icons/material-outlined";
import {nanoid} from "nanoid";
import {db, getTagStyleFromString} from "../../utils";
import {DataViewState, ViewData} from "./types";
import {TableWrapper} from "./style";

function DataView<T extends ViewData>(
  {state, storeName}: { state: DataViewState<T>, storeName: string }
) {
  const {status, values} = state;

  const navigator = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [addRecord, setAddRecord] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const isDark = theme.useToken().theme.id;

  const tagOptions: SelectProps['options'] = [];
  values.forEach(record => {
    record.tags.forEach(tag => {
      tagOptions.push({
        label: tag,
        value: tag
      });
    })
  })
  const getInitialValues: () => ViewData = () => {
    return {
      uid: '',
      name: '',
      tags: [],
      lastModified: undefined,
      url: undefined,
      blob: undefined,
    }
  }

  const messageKey = 'message';

  const columns: ColumnsType<ViewData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, {tags}) => (
        <>
          {tags.map((tag) => {
            return (
              <Tag
                key={tag}
                style={getTagStyleFromString(tag, isDark)}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Last Modified',
      render: (_, record) => {
        const time = new Date(record.lastModified ?? 0);
        return time.toString();
      }
    },
    {
      title: 'Actions',
      render: (_, record) => {
        return (
          <Space size="small">
            {
              record.url && <Button
                type="text"
                size="small"
                icon={<Pageview size={18}/>}
                onClick={() => navigator(record.url ?? '')}
              />
            }
            <Button
              type="text"
              size="small"
              danger
              icon={<Delete size={18}/>}
              onClick={() => {
                db.data(storeName, 'delete', record.uid).then(res => {
                  messageApi.open({
                    key: messageKey,
                    type: 'success',
                    content: `item ${record.name} has been deleted.`,
                    duration: 1
                  }).then(_ => {
                    navigator(0);
                  });
                });
              }}
            />
          </Space>
        )
      }
    }
  ];

  return <TableWrapper direction="vertical">
    {contextHolder}
    <Button
      icon={<AddChart size={18}/>}
      onClick={() => setAddRecord(true)}
    >Add {storeName}</Button>
    <Table
      columns={columns}
      dataSource={values}
      rowKey={record => record.uid}
    />
    <Modal
      open={addRecord}
      confirmLoading={modalLoading}
      title={`New ${storeName}`}
      onOk={() => {
        setModalLoading(true);
        messageApi.open({
          key: messageKey,
          type: 'loading',
          content: 'Loading...',
        });
        const fields = form.getFieldValue([]);
        fields.uid = nanoid(9);
        fields.url = `/${storeName}/${fields.uid}/${fields.name.toLowerCase().split(' ').join('-')}`;
        fields.lastModified = Date.now();
        fields.data = {};
        db.data(storeName, 'add', fields).then(res => {
          setModalLoading(false);
          setAddRecord(false);
          messageApi.open({
            key: messageKey,
            type: 'success',
            content: `new ${storeName} has been added.`,
            duration: 1
          }).then(_ => {
            navigator(0);
          });
        })
      }}
      onCancel={() => setAddRecord(false)}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={getInitialValues()}
      >
        <Form.Item name={['name']} label='Name'>
          <Input/>
        </Form.Item>
        <Form.Item name={['tags']} label='Tags'>
          <Select
            mode="tags"
            style={{width: '100%'}}
            placeholder="Tags Mode"
            options={tagOptions}
            tagRender={({label, value, closable, onClose}) => (
              <Tag
                style={getTagStyleFromString(value, isDark)}
                closable={closable}
                onClose={onClose}
              >{label}</Tag>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  </TableWrapper>
}

export default DataView;