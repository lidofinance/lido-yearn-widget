import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import WalletButton from './WalletButton'

const HeaderContainer = styled.div`
  width: 1040px;
  height: 100%;
  margin: 24px auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
`

const DisclaimerContainer = styled.div`
  position: absolute;
  top: 2px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Disclaimer = styled.div`
  padding: 8px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d1d8df;
  color: #1477f5;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`

const Logo = () => (
  <svg
    width={82}
    height={32}
    viewBox="0 0 82 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2105 0L19.1299 12.3963L11.2101 17.0118L3.29129 12.3962L11.2105 0ZM5.71555 11.81L11.2105 3.20857L16.7055 11.8101L11.2102 15.0126L5.71555 11.81Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M11.1988 19.7365L2.01216 14.3819L1.76128 14.7746C-1.06818 19.2037 -0.436261 25.0041 3.28055 28.7203C7.65434 33.0932 14.7457 33.0932 19.1194 28.7203C22.8363 25.0041 23.4682 19.2037 20.6387 14.7746L20.3878 14.3818L11.1988 19.7365Z"
      fill="url(#paint1_linear)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M82 16C82 13.9059 81.5834 11.8118 80.7821 9.87712C79.9808 7.9424 78.7946 6.16704 77.3136 4.6864C75.833 3.20544 74.0576 2.0192 72.1229 1.21792C70.1882 0.41664 68.0941 0 66 0C63.9059 0 61.8118 0.41664 59.8771 1.21792C57.9424 2.0192 56.167 3.20544 54.6864 4.6864C53.2054 6.16704 52.0192 7.9424 51.2179 9.87712C50.4166 11.8118 50 13.9059 50 16C50 18.0941 50.4166 20.1882 51.2179 22.1229C52.0192 24.0576 53.2054 25.833 54.6864 27.3136C56.167 28.7946 57.9424 29.9808 59.8771 30.7821C61.8118 31.5834 63.9059 32 66 32C68.0941 32 70.1882 31.5834 72.1229 30.7821C74.0576 29.9808 75.833 28.7946 77.3136 27.3136C78.7946 25.833 79.9808 24.0576 80.7821 22.1229C81.5834 20.1882 82 18.0941 82 16Z"
      fill="url(#paint2_linear)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M65.1731 8.776H66.8269V23.2246H65.1731V8.776Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M64.2346 15.5728V13.8461C62.9082 13.1936 61.9949 11.8285 61.9949 10.2502C61.9949 8.03906 63.7882 6.24578 66 6.24578C68.4835 6.24578 70.2768 8.03906 70.2768 10.2502C70.2768 10.8077 70.1623 11.3386 69.8874 11.9693L69.1811 9.6733L67.7655 10.1158L69.0208 14.8941L73.8944 13.1011L73.3021 11.7037L71.4845 12.3258C71.8135 11.6125 71.8781 11.088 71.8781 10.2502C71.8781 7.15394 69.368 4.64386 66 4.64386C62.9037 4.64386 60.3936 7.15394 60.3936 10.2502C60.3936 12.7296 62.0035 14.833 64.2346 15.5728Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M67.7654 16.4278V18.1546C69.0918 18.8074 70.0051 20.1722 70.0051 21.7504C70.0051 23.9616 68.2118 25.7549 66 25.7549C63.5165 25.7549 61.7232 23.9616 61.7232 21.7504C61.7232 21.193 61.8378 20.6621 62.1126 20.0314L62.8189 22.3274L64.2346 21.8848L62.9792 17.1066L58.1056 18.8998L58.6979 20.297L60.5155 19.6749C60.1866 20.3882 60.1219 20.9126 60.1219 21.7504C60.1219 24.8467 62.632 27.3568 66 27.3568C69.0963 27.3568 71.6064 24.8467 71.6064 21.7504C71.6064 19.271 69.9965 17.1677 67.7654 16.4278Z"
      fill="white"
    />
    <path
      d="M37.543 15.373H41.5078V17.082H37.543V21.5742H35.7266V17.082H31.7617V15.373H35.7266V11.2227H37.543V15.373Z"
      fill="#505A7A"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="-11.5"
        y1="10.5"
        x2={18}
        y2="44.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#157BF8" />
        <stop offset={1} stopColor="#1360B3" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="-11.5"
        y1="10.5"
        x2={18}
        y2="44.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#157BF8" />
        <stop offset={1} stopColor="#1360B3" />
      </linearGradient>
      <linearGradient
        id="paint2_linear"
        x1={34}
        y1={16}
        x2={66}
        y2={48}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0077FC" />
        <stop offset={1} stopColor="#095EB5" />
      </linearGradient>
    </defs>
  </svg>
)

const HeaderWrapper = styled.div`
  position: relative;
`

const LogoWrapper = styled.div`
  cursor: pointer;
`

export default function Header() {
  return (
    <HeaderWrapper>
      <DisclaimerContainer>
        <Disclaimer>This project is in beta. Use at your own risk.</Disclaimer>
      </DisclaimerContainer>
      <HeaderContainer>
        <Link href="/" shallow={true}>
          <LogoWrapper>
            <Logo />
          </LogoWrapper>
        </Link>
        <WalletButton />
      </HeaderContainer>
    </HeaderWrapper>
  )
}
