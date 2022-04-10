import React from 'react';
import Header from './Header'
import { Container } from 'semantic-ui-react';
import Head from 'next/head'


const Layout = (props) => {

  return (
    <div>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />  
        <script src="https://cdn.jsdelivr.net/npm/semantic-ui-react/dist/umd/semantic-ui-react.min.js"></script>
    </Head>
    <Container>
      <Header/>
      {props.children}
    </Container>
    </div>
  )

}

export default Layout