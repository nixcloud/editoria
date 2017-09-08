AligmentBox with Label on the left

```js

const active = true;
const id = 'eyedee';
const noBorder = {};
const onClick = () => { return null };
const labelText = 'left';

<AlignmentBoxWithLabel
  active={active}
  noBorder={noBorder}
  id = {id}
  onClick={onClick}
  labelText={labelText}
/>
```
Inactive AligmentBox with Label on the right

```js

const active = false;
const id = 'eyedee';
const noBorder = {};
const onClick = () => { return null };
const labelPositionRight = true;
const labelText = 'right';

<AlignmentBoxWithLabel
  active={active}
  noBorder={noBorder}
  id = {id}
  onClick={onClick}
  labelPositionRight={labelPositionRight}
  labelText={labelText}
/>
```
