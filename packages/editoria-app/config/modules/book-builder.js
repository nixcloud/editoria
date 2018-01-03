module.exports = {
  chapter: {
    dropdownValues: {
      back: ['Appendix A', 'Appendix B', 'Appendix C'],
      front: ['Table of Contents', 'Introduction', 'Preface'],
    },
  },
  divisions: [
    {
      name: 'front',
      showNumberBeforeComponents: [],
    },
    {
      name: 'body',
      showNumberBeforeComponents: ['chapter'],
    },
    {
      name: 'back',
      showNumberBeforeComponents: [],
    },
  ],
}
