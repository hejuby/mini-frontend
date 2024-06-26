import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setModalStatus } from '../../redux/slices/loginModalSlice.ts';
import hamburgerBtn from '../../assets/images/hamburger-btn.svg';
import headerProfile from '../../assets/images/header-profile.svg';
import { AppDispatch } from '../../redux/store.ts';

const MenuContainer = styled.div`
  width: 13vh;
  height: 7vh;
  margin: 0 4vh;
  border: 1px solid lightgrey;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3vh;
  cursor: pointer;
  position: relative;

  @media (max-width: 768px) {
    padding: 0;
    border-radius: 50%;
    width: 4vh;
    height: 4vh;
  }
  @media (max-width: 600px) {
    width: 4vh;
    height: 4vh;
    border-radius: 50%;
    margin: 0 2vh 0 0.5vh;
  }
`;

const HamburgerBtn = styled.img`
  width: 3vh;
  @media (max-width: 768px) {
    display: none;
    width: 0vh;
  }
`;

const HeaderProfile = styled.img`
  width: 4vh;
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 8vh;
  right: 0;
  width: 18vh;
  background-color: white;
  border: 1px solid lightgrey;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: ${({ isOpen }) => (isOpen ? '20vh' : '0')};
  overflow: hidden;
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition:
    max-height 0.3s ease-out,
    visibility 0.3s ease-out;
  @media (max-width: 600px) {
    margin: 0 2vh;
  }
`;

const MenuItem = styled.div`
  padding: 1vh 2vh;
  font-size: 2vh;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const toggleMenu = (): void => {
    setIsOpen((prev) => !prev);
  };

  return (
    <MenuContainer onClick={toggleMenu}>
      <HamburgerBtn src={hamburgerBtn} alt="hamburger-btn" />
      <HeaderProfile src={headerProfile} alt="headerProfile" />
      <DropdownMenu isOpen={isOpen}>
        <MenuItem
          onClick={() => {
            dispatch(setModalStatus('login'));
          }}
        >
          Login
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(setModalStatus('signup'));
          }}
        >
          Sign Up
        </MenuItem>
      </DropdownMenu>
    </MenuContainer>
  );
}