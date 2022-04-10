import React from "react";
import { Menu } from 'semantic-ui-react';
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();

  function handleClick_navigate(path) {
    router.push(path);
  }

  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item onClick={ () => handleClick_navigate('/') }>
        CrowdCoin
      </Menu.Item>

      <Menu.Menu position='right' >

        <Menu.Item onClick={ () => handleClick_navigate('/') }>
          Campaigns
        </Menu.Item>

        <Menu.Item onClick ={() => handleClick_navigate('/campaigns/new')} >
          +
        </Menu.Item>
        
      </Menu.Menu>
    </Menu>
      )
}

export default Header;