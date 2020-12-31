import { useEffect, useState, useRef } from "react"
import styled from 'styled-components'
import Link from 'next/link'

import useToken from '../hooks/useToken'
import { TOKENS_BY_ID, formatEth } from '../utils'
import { white } from './colors'

const Card = styled.div`
  position: relative;
  overflow: hidden;
  background: ${white};
  border-radius: 16px;
  width: 280px;
  height: 280px;
  border-radius: 16px;
  margin-right: 36px;
  cursor: pointer;

  &:last-child {
    margin-right: 0px;
  }

  &:hover {
    background-color: var(--bg);
    border-color: transparent !important;
    box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.1);
  }

  &:hover::after {
    --size: 500px;
  }

  &::after {
    --size: 0;
    content: "";
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    transform: translate(-50%, -50%);
    background: radial-gradient(circle closest-side, var(--glow), transparent);
    transition: width 0.2s ease, height 0.2s ease;
  }

  &:hover > div > span {
    color: white;
  }

`

const CardContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
`

const Balance = styled.span`
  margin-top: 36px;
  font-family: 'Inconsolata', monospace;
  font-size: 32px;
  line-height: 24px;
  color: #2a2a2a;
`

const Available = styled.span`
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
  color: #515b79;
`

const Button = styled.div`
  margin: 12px;
  margin-top: 16px;
  background-color: #f4f6f8;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  padding: 12px;
  width: 256px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #E0E9F1;
  }
`


export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  function handleMouseMove(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  }

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener('mousemove', handleMouseMove, true);

      return () => {
        node.removeEventListener('mousemove', handleMouseMove, true);
      };
    }
  });

  return [ref, position];
};

export default function ConverterCard({ tokenConfig }) {
  const [elRef, position] = useMousePosition();
  const { assetFrom, assetTo, logo, bg, glow } = tokenConfig
  const { balance } = useToken(assetFrom)

  const tokenFrom = assetFrom === 'eth'
    ? { id: 'eth', name: 'ETH' }
    : TOKENS_BY_ID[assetFrom]

  const tokenTo = TOKENS_BY_ID[assetTo]

  return (
    <Link href={`/${tokenFrom.id}-to-${tokenTo.id}`}>
      <Card
        ref={elRef}
        style={{
          "--x": `${position.x}px`,
          "--y": `${position.y}px`,
          "--glow": glow,
          "--bg": bg,
        }}
      >
        <CardContent>
          {logo}
          <Balance>{`${formatEth(balance)}`}</Balance>
          <Available>{tokenFrom.name} Available</Available>
          <Button>Convert to {tokenTo.name}</Button>
        </CardContent>
      </Card>
    </Link>
  )
}
