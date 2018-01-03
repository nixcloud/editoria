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
      showNumberBeforeComponents: ['component'],
    },
    {
      name: 'body',
      showNumberBeforeComponents: ['chapter', 'part'],
    },
    {
      name: 'back',
      showNumberBeforeComponents: ['component'],
    },
  ],
}
