import React from "react";
import CTA from "./CTA";
import styles from "./FamilyCard.module.css";
import { Link } from "react-router-dom";

export default function SMCard({title, answer, handleClick1, handleClick2, cta1, cta2, link}) {
  return (
    <div className={styles.FamilyCard}>
        <div>
            <span>{title} : </span>
        <h1>{answer}</h1>
        </div>
           <div className={styles.cta}>
            {cta1 && <Link to={`/${link}`} > <CTA title={cta1} handleClick={handleClick1}/></Link> }
            { cta2&& <CTA title={cta2} handleClick={handleClick2}/> }
           </div>
    </div>
  );
}
