import React from 'react'
import { Link } from 'react-router-dom'

interface navProps{
    isAuth?:boolean,
    isAdmin?:boolean,

}

const Header = ({isAuth=false, isAdmin=false}:navProps) => {


  return (
    <nav>
        <Link to="/">Get Back (Future Icon)</Link>
        Planet's Call
      
    </nav>
  )
}

export default Header
