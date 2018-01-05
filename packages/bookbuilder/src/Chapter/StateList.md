State List

```js
const chapter =
  {
    progress: {
      style: 0,
      edit: 0,
      clean: 0,
      review: 0
    },
    id: 1
  };
const stateValues = {
      clean: ['To Clean', 'Cleaning', 'Cleaned'],
      edit: ['To Edit', 'Editing', 'Edited'],
      review: ['To Review', 'Reviewing', 'Reviewed'],
      style: ['To Style', 'Styling', 'Styled'],
    }
const update = (data) => {
  console.log('data', data)
};

<StateList
  chapter={chapter}
  roles={['admin']}
  stateValues={stateValues}
  update={update}
/>
```
