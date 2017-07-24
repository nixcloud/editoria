import React from 'react'
import { each, isNumber } from 'lodash'

import styles from '../styles/bookBuilder.local.scss'

class FileUploader extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      counter: {
        front: null,
        body: null,
        back: null
      }
    }
  }

  onChange (event) {
    event.preventDefault()
    const { book, convert, create } = this.props
    console.log(book)

    const files = event.target.files

    const divisionMapper = {
      a: 'front',
      b: 'body',
      c: 'back'
    }

    each(files, (file) => {
      const name = file.name
      // console.log(name)
      const nameSpecifier = name.slice(0, 1)
      console.log(nameSpecifier)

      const division = divisionMapper[nameSpecifier]
      let subCategory

      if (division !== 'body') {
        subCategory = 'component'
      } else {
        console.log(name.split(5, 10))
        if (name.split(5, 9) === 'Part') {
          subCategory = 'part'
        } else {
          subCategory = 'chapter'
        }
      }

      console.log(convert)

      convert(file).then((response) => {
        // TODO -- refactor this with onAddClick in Division
        // move them to bookbuilder and pass down to both as prop

        console.log(response)

        const fragment = {
          book: book.id,
          subCategory,
          division,
          alignment: {
            left: false,
            right: false
          },
          progress: {
            style: 0,
            edit: 0,
            review: 0,
            clean: 0
          },
          lock: null,

          // index: isNumber(this.state.division) ? ,
          kind: 'chapter',
          title: name,

          status: 'unpublished',
          author: '',
          source: response.converted,
          comments: {},
          trackChanges: false
        }

        let index
        if (isNumber(this.state.counter[division])) {
          index = this.state.counter[division] + 1
        } else {
          index = 0
        }

        fragment.index = index

        create(book, fragment)

      }).catch((error) => {
        console.log(error)
      })
    })
  }

  render () {
    return (
      <div
        className={styles.teamManagerBtn}
      >
        <a>
          Upload files
          <input
            accept='.docx'
            multiple
            name='fileUploader'
            onChange={this.onChange}
            type='file'
          />
        </a>
      </div>
    )
  }
}

FileUploader.propTypes = {
  book: React.PropTypes.object.isRequired,
  convert: React.PropTypes.func.isRequired,
  create: React.PropTypes.func.isRequired
}

export default FileUploader
