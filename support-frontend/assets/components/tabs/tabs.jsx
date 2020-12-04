// @flow

import React, { type Node } from 'react';
import { tabList, tabButton, tabPanel } from './tabsStyles';

type TabElement = 'a' | 'button';

type TabProps = {|
  id: string,
  text: string,
  href?: string,
  selected: boolean,
  content: Node,
|}

type PropTypes = {|
  tabElement: TabElement,
  tabs: TabProps[],
  onTabChange?: (tabName: string) => void
|};

function Tabs({ tabElement, tabs, onTabChange }: PropTypes) {
  const Element = tabElement;

  return (
    <div>
      <div css={tabList} role="tablist">
        {tabs.map((tab: TabProps) => {
          const selected = tab.selected ? 'true' : 'false';
          return (
            <Element
              css={tabButton}
              role="tab"
              id={tab.id}
              href={tab.href}
              aria-selected={selected}
              aria-controls={`${tab.id}-tab`}
              onClick={() => onTabChange && onTabChange(tab.id)}
            >
              {tab.text}
            </Element>
          );
        })}
      </div>
      {tabs.map((tab: TabProps) => (
        <div css={tabPanel} role="tabpanel" id={`${tab.id}-tab`} aria-labelledby={tab.id} hidden={!tab.selected}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}

Tabs.defaultProps = {
  onTabChange: () => {},
};

export default Tabs;
