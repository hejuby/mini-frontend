import { useEffect, useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import CardGrid from '../Components/CardGrid.tsx';
import { RoomResponse } from '../assets/interfaces.ts';
import useGeolocation from '../util/currentLocationUtil.ts';
import { useRandomRooms } from '../hooks/room.tsx';
import banner1 from '../assets/images/banner1.jpg';
import banner2 from '../assets/images/banner2.jpg';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AddContainer = styled.div`
  width: 100%;
  height: 30vh;
  border-radius: 20px;
  margin-bottom: 2vh;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface AddImageProps {
  show: boolean;
}

const AddImage = styled.img.attrs<AddImageProps>(({ show }) => ({
  style: {
    opacity: show ? 1 : 0,
  },
}))<AddImageProps>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  transition: opacity 1s ease-in-out;
`;

const MainTitle = styled.div`
  height: 7vh;
  margin-top: 4vh;
  font-size: 4vh;
  font-weight: 500;
  color: #818080;
  text-align: center;
`;

const MainFooter = styled.div`
  height: 20vh;
  margin-top: 5vh;
  border-top: 1px solid #dcdcdc;
  padding: 2vh 5vh;
`;

const FooterLogo = styled.div`
  margin-bottom: 2vh;
  font-size: 4vh;
  font-weight: bold;
  color: #999999;
`;

const Copywriter = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FooterContent = styled.p`
  font-size: 1.5vh;
  line-height: 2vh;
`;

const MembersCotainer = styled.p`
  display: flex;
  text-align: center;
`;

const MemberTeam = styled.div`
  font-size: 3vh;
  font-weight: bold;
  margin-bottom: 2vh;
  color: #999999;
`;

const FeMembers = styled.div`
  margin-right: 4vh;
  flex-direction: column;
`;

const BeMembers = styled.div`
  flex-direction: column;
`;

const Members = styled.p`
  font-size: 2vh;
  line-height: 3vh;
  color: #999999;
  text-align: center;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3f51b5;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
`;

function MainPage() {
  const location = useGeolocation();
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    { id: 'banner1', src: banner1 },
    { id: 'banner2', src: banner2 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const lat = useMemo(() => location.coordinates!.lat, [location.coordinates]);
  const lng = useMemo(() => location.coordinates!.lng, [location.coordinates]);

  const { data, isLoading, isError } = useRandomRooms({
    map_x: lng,
    map_y: lat,
    radius: 4.5,
  });

  if (!location.loaded) {
    return (
      <div>
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
        <p>
          현재 위치를 검색할 수 없습니다. 브라우저의 위치 권한을 허용해주세요.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    );
  }

  if (isError) {
    return (
      <div>
        <p>숙소 정보를 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  return data ? (
    <>
      <AddContainer>
        {images.map((image) => (
          <AddImage
            key={image.id}
            src={image.src}
            show={image.id === images[currentImage].id}
          />
        ))}
      </AddContainer>
      <MainTitle>주변 숙소</MainTitle>
      <CardGrid listings={data as RoomResponse[]} />
      <MainFooter>
        <ContentContainer>
          <Copywriter>
            <FooterLogo>aircnc</FooterLogo>
            <FooterContent>
              (주)aircnc |대표이사 : 변희준 | 사업자 등록번호 : 22X-8X-4XXX5 |
              통신판매업신고 : 강남-142XX호 | 메일 : plz@aircnc.com
            </FooterContent>
            <FooterContent>
              관광사업자 등록번호 : 제2024-3x호 | 주소 : 평양시 강남구 장벽2동
              함흥냉면 2층 3번테이블 옆자리
            </FooterContent>
            <FooterContent>
              호스팅서비스 제공자 : 주식회사 에어씨엔시 고객센터 : 16xx-1xxx
              (오전 9시 - 오후 00시)
            </FooterContent>
          </Copywriter>
          <MembersCotainer>
            <FeMembers>
              <MemberTeam>Front-End</MemberTeam>
              <Members>변희준</Members>
              <Members>김상화</Members>
              <Members>박성현</Members>
            </FeMembers>
            <BeMembers>
              <MemberTeam>Back-End</MemberTeam>
              <Members>송민석</Members>
              <Members>길보미</Members>
              <Members>안지수</Members>
              <Members>노성빈</Members>
            </BeMembers>
          </MembersCotainer>
        </ContentContainer>
      </MainFooter>
    </>
  ) : (
    <>
      <p>주위에 예약 가능한 숙소가 없습니다.</p>
      <MainFooter />
    </>
  );
}

export default MainPage;
