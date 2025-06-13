import React from 'react'
import styles from "./CTA.module.css"

export default function CTA({title, handleClick}) {
  return (
    <div className={styles.cta}>
      <button onClick={handleClick}>
        {title}
      </button>
    </div>
  )
}
