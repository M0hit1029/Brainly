import React, { ReactElement } from 'react'

interface ButtonProps{
    variant: "primary"|"secondary",
    size: "sm"|"md"|"lg",
    text: string,
    startIcon?: ReactElement,
    endIcon?: ReactElement,
    onClick?: ()=>void;
}

const variantStyles = {   //acts like a map
    "primary":"bg-purple-600 text-white-600",
    "secondary":"bg-gray-200 text-purple-400"
}

const sizedStyles = {   //acts like map
    "sm":"p-2", //key:value pairs
    "md":"p-3",
    "lg":"p-4"

}

const defaultStyles = "rounded-md gap-2 flex items-center justify-center"

export const Button = (props: ButtonProps) => {
  return (
    <button className={`${variantStyles[props.variant]} ${defaultStyles} ${sizedStyles[props.size]}`} onClick={props.onClick}>
      {props.startIcon}
      {props.text}
    </button>
  )
}
