import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RoomResponse } from '../assets/interfaces.ts';
import { selectRoom } from '../redux/slices/roomDetailSlice.ts';
import formatNumber from '../util/formatNumber.ts';

const CardContainer = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;
const ImageContainer = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;
const Image = styled.img`
  position: absolute;
  padding: 10px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-sizing: border-box;
  object-fit: cover;
`;
const TextContainer = styled.div`
  margin: 10px 10px;
`;
const Title = styled.h3`
  margin: 10px 0;
  font-size: 20px;
  color: #333;
`;
const Address = styled.p`
  margin: 10px 0;
  font-size: 15px;
  color: #666;
`;
const Info = styled.p`
  margin: 10px 0;
  font-size: 15px;
  font-weight: bold;
  color: #333;
`;

type CardProps = RoomResponse & {
  order?: number;
};

function Card(props: CardProps) {
  const { room_id, image_url: imageUrl, name, city, price, order } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [myMarker, setMyMarker] = useState<HTMLDivElement | null>(null);

  const handleClick = async () => {
    try {
      const response = await fetch(
        `http://ec2-52-79-187-32.ap-northeast-2.compute.amazonaws.com/api/rooms/${room_id}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch room details');
      }
      const data = await response.json();
      const roomData = {
        room_response: data.body.room_response,
        reserved_date: data.body.reserved_date,
      };
      dispatch(selectRoom(roomData));
      navigate(`/detail/${room_id}`);
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  const handleMouseEnter = () => {
    if (!order && order !== 0) {
      return;
    }

    const map = document.getElementById('map');

    if (!map) {
      return;
    }

    const marker =
      map.firstElementChild?.firstElementChild?.firstElementChild?.lastElementChild?.children
        .item(1)
        ?.children.item(order) as HTMLDivElement;

    if (!marker) {
      return;
    }

    marker.style.width = '36px';
    marker.style.height = '36px';
    marker.style.transform = 'translate(-4px, -4px)';
    marker.style.zIndex = '10000';

    const markerImage = marker.firstElementChild as HTMLImageElement;

    markerImage.style.width = '36px';
    markerImage.style.height = '36px';

    setMyMarker(marker);
  };

  const handleMouseLeave = () => {
    if (!myMarker) {
      return;
    }

    myMarker.style.width = '28px';
    myMarker.style.height = '28px';
    myMarker.style.transform = 'translate(0, 0)';
    myMarker.style.zIndex = '1000';

    const markerImage = myMarker.firstElementChild as HTMLImageElement;

    markerImage.style.width = '28px';
    markerImage.style.height = '28px';
  };

  return (
    <CardContainer
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ImageContainer>
        <Image src={imageUrl || `/defaultImage.jpg`} alt={name} />
      </ImageContainer>
      <TextContainer>
        <Title>{name}</Title>
        <Address>{city}</Address>
        <Info>{formatNumber(price)}원/박</Info>
      </TextContainer>
    </CardContainer>
  );
}

export default Card;
