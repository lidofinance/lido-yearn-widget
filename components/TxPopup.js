import styled, {keyframes} from "styled-components";

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: rgba(0,0,0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Popup = styled.div`
  width: 420px;
  height: 320px;
  background: white;
  border-radius: 16px;
  padding: 16px;
`

const PopupInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
`

const Title = styled.div`
  margin: 0 auto;
  text-align: center;
  color: #2a2a2a;
  font-size: 28px;
  max-width: 600px;
  margin-top: 40px;
`

const Subtitle = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-top: 8px;
  color: #505a7a;
  font-size: 16px;
  width: 70%;
  max-width: 400px;
`
const ConfirmTx = styled.div`
  font-size: 12px;
  font-weigth: 300;
  color: #5D6B7B;
  opacity: 0.7;
  text-align: center;
  line-height: 20px;
  margin-top: 24px;
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Loader = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;

  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #1F7BF1;
    border-color: #1F7BF1 transparent #1F7BF1 transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`

export default function TxPopup({header, text, action}) {
  return (
    <Background>
      <Popup>
        <PopupInner>
          <Loader/>
          <Title>{header}</Title>
          <Subtitle>{text}</Subtitle>
          <ConfirmTx>{action}</ConfirmTx>
        </PopupInner>
      </Popup>
    </Background>
  )
}
