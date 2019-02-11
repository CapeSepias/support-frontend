import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/button.jsx');
  require('../stories/dialog.jsx');
  require('../stories/form.jsx');
  require('../stories/header.jsx');
  require('../stories/list.jsx');
  require('../stories/hero.jsx');
}

configure(loadStories, module);
