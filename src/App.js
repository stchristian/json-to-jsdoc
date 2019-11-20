import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash'
import './App.css';
import 'jsoneditor-react/es/editor.min.css';

/**
 * 
 * @param {Object} object
 */
function generateJSDocTypedefFromObject(object) {
  const beginComment = '/**'
  const typedefHeader = '* @typedef {Object} YOUR_CUSTOM_TYPE'
  const commentPrefix = '* '
  const endComment = '**/'
  let jsdocs = [beginComment, typedefHeader, commentPrefix]

  function getPropPath(root, prop) {
    return `${root}${root && '.'}${prop}`
  }

  const evalObjectKeys = (obj, root = '') => {
    _.forIn(obj, (value, prop) => {
      const propPath = getPropPath(root, prop)
      if (Array.isArray(obj[prop])) {
        if(obj[prop].length === 0) {
          jsdocs.push(`* @property {[]} ${propPath}`)
        } 
        else {
          const firstElement = obj[prop][0]
          if (typeof firstElement === 'object') {
            jsdocs.push(`* @property {Object[]} ${propPath}`)
            evalObjectKeys(firstElement, propPath + "[]")
          }
          else {
            jsdocs.push(`* @property {${typeof firstElement}[]} ${propPath}`)
          }
        }
      }
      else {
        jsdocs.push(`* @property {${typeof obj[prop]}} ${propPath}`)
        if (typeof obj[prop] === 'object') {
          evalObjectKeys(obj[prop], propPath)
        }
      }
    })
  }
  evalObjectKeys(object)
  jsdocs.push(endComment)
  return jsdocs
}

function App() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState([])
  const textAreaRef = useRef(null)
  const handleChange = (event) => {
    setValue(event.target.value)
  }
  
  useEffect(() => {
    try {
      const parsedObject = JSON.parse(value)
      setResult(generateJSDocTypedefFromObject(parsedObject))
    } catch (err) {
      setResult(['Cannot parse JSON'])
    }
  }, [value])

  const handleClick = () => {
    textAreaRef.current.select()
    document.execCommand("copy");
  }
  return (
    <>
      <h1> Convert JSON to JSDoc typedef </h1>
      <textarea value={value} onChange={handleChange} />
      <textarea ref={textAreaRef} readOnly="true" value={ result.join('\n')}></textarea>
      <button onClick={handleClick}>Copy to clipboard</button>
    </>
  )
}

export default App;
