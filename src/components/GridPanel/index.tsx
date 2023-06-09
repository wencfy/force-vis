import React from "react";
import {useSearchParams} from "react-router-dom";
import {theme} from "antd";
import {Delete, ModeEdit, Pageview} from "@styled-icons/material-outlined";
import {ArrowDown, CardTitleWrapper, StyledCard, StyledDropdown} from "./style";
import {DashboardPanel} from "../../utils";

const GridPanel = React.forwardRef<HTMLDivElement, {
  updatePanel: ({id, newPanel, toDb}: { id: string, newPanel?: DashboardPanel, toDb?: boolean }) => void
  panelInfo?: {
    title?: string,
    id?: string,
  },
  style?: React.CSSProperties,
  className?: string,
  onMouseDown?: React.MouseEventHandler,
  onMouseUp?: React.MouseEventHandler,
  onTouchEnd?: React.TouchEventHandler,
  children?: React.ReactNode,
}>((
  {
    updatePanel,
    panelInfo: {
      title,
      id
    } = {},
    style,
    className,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    children,
    ...props
  }, ref) => {
  const token = theme.useToken().token;
  const [, setSearchParams] = useSearchParams();

  const items = [
    {
      label: 'view',
      key: '0',
      icon: <Pageview size={18}/>,
      onClick: () => {
        if (id) {
          setSearchParams({
            viewPanel: id
          })
        }
      }
    },
    {
      label: 'edit',
      key: '1',
      icon: <ModeEdit size={18}/>,
      onClick: () => {
        if (id) {
          setSearchParams({
            editPanel: id
          })
        }
      }
    },
    {
      label: 'delete',
      key: '2',
      icon: <Delete size={18}/>,
      onClick: () => {
        if (id) {
          updatePanel({id});
        }
      }
    },
  ];

  return (
    <StyledCard
      ref={ref}
      style={{...style}}
      className={className}

      size='small'
      token={token}
      title={(
        <CardTitleWrapper
          token={token}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchEnd={onTouchEnd}
        >
          <span>{title}</span>
          <StyledDropdown
            menu={{items}}
            trigger={['click']}
          >
            {/* 防止报 findDOM deprecated 错误，加了一层 div */}
            <div>
              <ArrowDown size={16}/>
            </div>
          </StyledDropdown>
        </CardTitleWrapper>
      )}
    >
      {children}
    </StyledCard>
  )
});

export default GridPanel;
