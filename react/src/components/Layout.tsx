import React, { ReactElement } from 'react'
import Header from './Header'

interface LayoutProps {
    children?: ReactElement | ReactElement[]
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
        <Header/>
        { children }
    </div>
  )
}

export default Layout