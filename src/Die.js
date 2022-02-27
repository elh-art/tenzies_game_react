import React from 'react'

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? '#59E391' : 'white',
  }
  return (
    <div className="die-face" style={styles} onClick={props.holdDice}>
      <div className={'dot' + props.clsName[0]}></div>
      {props.clsName[1] && <div className={'dot' + props.clsName[1]}></div>}
      {props.clsName[2] && <div className={'dot' + props.clsName[2]}></div>}
      {props.clsName[3] && <div className={'dot' + props.clsName[3]}></div>}
      {props.clsName[4] && <div className={'dot' + props.clsName[4]}></div>}
      {props.clsName[5] && <div className={'dot' + props.clsName[5]}></div>}
      <h2 className="die-num">{props.value}</h2>
    </div>
  )
}
