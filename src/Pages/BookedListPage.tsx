import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Reservation } from '../assets/interfaces.ts';
import { getPayments } from '../api/request.ts';
import formatNumber from '../util/formatNumber.ts';

const BookedListContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin-top: 10vh;
`;

const BookedListBody = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 15vh;
`;

const BookedListTitle = styled.div`
  font-size: 4vh;
  font-weight: 400;
`;

const SeparationLine = styled.div`
  width: 100%;
  height: 0.1px;
  margin: 2rem 0;
  background-color: lightgrey;
`;

const ReserTitleContainer = styled.div`
  width: 100%;
  height: 7vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReserTitleRoom = styled.div`
  width: 40%;
  height: 4vh;
  margin-right: 1vh;
  padding-left: 2vh;
  border-right: 1px solid lightgrey;
  display: flex;
  align-items: center;
`;

const ReserTitleDate = styled.div`
  width: 20%;
  height: 4vh;
  border-right: 1px solid lightgrey;
  margin-right: 1vh;
  display: flex;
  align-items: center;
`;

const ReserTitleGuest = styled.div`
  width: 20%;
  height: 4vh;
  border-right: 1px solid lightgrey;
  margin-right: 1vh;
  display: flex;
  align-items: center;
`;

const ReserTitlePrice = styled.div`
  width: 20%;
  height: 4vh;
  display: flex;
  align-items: center;
`;

const ReserCotentContainer = styled.div`
  width: 100%;
  height: 7vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReserContentRoom = styled.div`
  width: 40%;
  height: 4vh;
  margin-right: 1vh;
  padding-left: 2vh;
  display: flex;
  align-items: center;
`;

const ReserContentDate = styled.div`
  width: 20%;
  height: 4vh;
  margin-right: 1vh;
  display: flex;
  align-items: center;
`;

const ReserContentGuest = styled.div`
  width: 20%;
  height: 4vh;
  margin-right: 1vh;
  display: flex;
  align-items: center;
`;

const ReserContentPrice = styled.div`
  width: 20%;
  height: 4vh;
  display: flex;
  align-items: center;
`;

interface ReservationRowProps {
  reservation: Reservation;
}

function ReservationRow(props: ReservationRowProps) {
  const { reservation } = props;
  const formatDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString().replace(/\.$/, '');
    return formattedDate;
  };

  return (
    <ReserCotentContainer>
      <ReserContentRoom>{reservation.room.name}</ReserContentRoom>
      <ReserContentDate>
        {formatDate(new Date(reservation.checkInDate))} -{' '}
        {formatDate(new Date(reservation.checkOutDate))}
      </ReserContentDate>
      <ReserContentGuest>{reservation.room.max_capacity}</ReserContentGuest>
      <ReserContentPrice>
        {formatNumber(reservation.room.price)}
      </ReserContentPrice>
    </ReserCotentContainer>
  );
}

function BookedListPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const payments = await getPayments();

        const reservationsData = payments.map((payment: any) => ({
          room: payment.room_response,
          checkInDate: payment.check_in,
          checkOutDate: payment.check_out,
        }));
        setReservations(reservationsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservations();
  }, []);

  if (!reservations.length) {
    return (
      <div>
        <BookedListContainer>
          <BookedListBody>
            <BookedListTitle>예약 목록</BookedListTitle>
          </BookedListBody>
          <SeparationLine />
          <p>예약된 내역이 없습니다.</p>
        </BookedListContainer>
      </div>
    );
  }

  return (
    <div>
      <BookedListContainer>
        <BookedListBody>
          <BookedListTitle>예약 목록</BookedListTitle>
        </BookedListBody>
        <SeparationLine />
        <ReserTitleContainer>
          <ReserTitleRoom>방 이름</ReserTitleRoom>
          <ReserTitleDate>날짜</ReserTitleDate>
          <ReserTitleGuest>인원</ReserTitleGuest>
          <ReserTitlePrice>가격</ReserTitlePrice>
        </ReserTitleContainer>
        {reservations.map((reservation) => (
          <ReservationRow
            key={
              reservation.room.room_id.toString() +
              reservation.checkInDate.toString().replace(/-/g, '') +
              reservation.checkOutDate.toString().replace(/-/g, '')
            }
            reservation={reservation}
          />
        ))}
      </BookedListContainer>
    </div>
  );
}

export default BookedListPage;
